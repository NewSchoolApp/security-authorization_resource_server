import * as crypto from 'crypto';
import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ChangePasswordService } from './change-password.service';
import { MailerService } from '@nest-modules/mailer';
import { RoleService } from '../../SecurityModule/service/role.service';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { AdminChangePasswordDTO } from '../dto/admin-change-password.dto';
import { UserRepository } from '../repository/user.repository';
import { ForgotPasswordDTO } from '../dto/forgot-password';
import { ChangePasswordForgotFlowDTO } from '../dto/change-password-forgot-flow.dto';
import { UserNotFoundError } from '../../SecurityModule/exception/user-not-found.error';
import { NewUserDTO } from '../dto/new-user.dto';
import { UserUpdateDTO } from '../dto/user-update.dto';
import { ChangePasswordDTO } from '../dto/change-password.dto';
import { User } from '@prisma/client';
import SecurePassword from 'secure-password';
import { SecurityService } from '../../SecurityModule/service/security.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const securePassword = require('secure-password');

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly changePasswordService: ChangePasswordService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
  ) {}

  public async getAll(): Promise<User[]> {
    return this.repository.findMany();
  }

  public async findById(id: string) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async add(user: NewUserDTO) {
    const role = await this.roleService.findByRoleName(user.roleName);
    const hashPassword: string = await this.createHashedPassword(user.password);
    try {
      return await this.repository.create({
        data: {
          ...user,
          password: hashPassword,
          roleId: role.id,
        },
      });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User with same email already exists');
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete({ where: { id } });
  }

  public async update(
    id: string,
    userUpdatedInfo: UserUpdateDTO,
  ): Promise<User> {
    return await this.repository.update({
      where: {
        id,
      },
      data: {
        ...userUpdatedInfo,
      },
    });
  }

  public async hashUserPassword(user: User, password: string) {
    const pwd: SecurePassword = securePassword();
    const hashBuffer = await pwd.hash(Buffer.from(password));
    return this.repository.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashBuffer.toString(),
      },
      include: {
        Role: {
          include: {
            Policies: true,
          },
        },
      },
    });
  }

  public async forgotPassword({
    username,
  }: ForgotPasswordDTO): Promise<string> {
    const user = await this.findByUsername(username);
    const changePassword = await this.changePasswordService.createChangePasswordRequest(
      user.id,
    );
    await this.sendChangePasswordEmail(user, changePassword.id);
    return changePassword.id;
  }

  public async findByUsername(username: string) {
    const user = await this.repository.findByUsername(username);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  public async validateChangePassword(
    changePasswordRequestId: string,
  ): Promise<void> {
    const changePassword = await this.changePasswordService.findById(
      changePasswordRequestId,
    );
    if (
      Date.now() >
      new Date(changePassword.createdAt).getTime() +
        changePassword.expirationTimeInMilliseconds
    ) {
      throw new GoneException();
    }
  }

  public async adminChangePassword(
    id: string,
    changePasswordDTO: AdminChangePasswordDTO,
  ): Promise<User> {
    if (changePasswordDTO.newPassword !== changePasswordDTO.confirmNewPassword)
      throw new BadRequestException('New passwords are not the same');
    const user: User = await this.findById(id);
    const pwd: SecurePassword = securePassword();
    const result = pwd.verify(
      Buffer.from(changePasswordDTO.oldPassword),
      Buffer.from(user.password),
    );
    if (result === securePassword.INVALID) {
      throw new BadRequestException(
        'Old password does not match with current password',
      );
    }
    user.password = await this.createHashedPassword(
      changePasswordDTO.newPassword,
    );
    return await this.repository.create({ data: user });
  }

  public async changePassword(
    id: string,
    changePasswordDTO: ChangePasswordDTO,
  ): Promise<User> {
    if (
      changePasswordDTO.newPassword !== changePasswordDTO.confirmNewPassword
    ) {
      throw new BadRequestException('New passwords does not match');
    }
    const user = await this.findById(id);
    const result = await SecurityService.validPassword(
      user.password,
      changePasswordDTO.password,
    );
    if (result === securePassword.INVALID) {
      throw new BadRequestException(
        'Old password does not match with given password',
      );
    }
    user.password = await this.createHashedPassword(
      changePasswordDTO.newPassword,
    );
    return await this.repository.update({
      where: {
        id: user.id,
      },
      data: {
        password: await this.createHashedPassword(
          changePasswordDTO.newPassword,
        ),
      },
    });
  }

  public async changePasswordForgotPasswordFlow(
    changePasswordRequestId: string,
    changePasswordDTO: ChangePasswordForgotFlowDTO,
  ): Promise<User> {
    if (
      changePasswordDTO.newPassword !== changePasswordDTO.confirmNewPassword
    ) {
      throw new BadRequestException('passwords does not match');
    }
    const changePasswordRequest = await this.changePasswordService.findById(
      changePasswordRequestId,
    );
    return await this.repository.update({
      where: { id: changePasswordRequest.userId },
      data: {
        password: await this.createHashedPassword(
          changePasswordDTO.newPassword,
        ),
      },
    });
  }

  private async createHashedPassword(password: string): Promise<string> {
    const pwd: SecurePassword = securePassword();
    const hashedPassword = await pwd.hash(Buffer.from(password));
    return hashedPassword.toString();
  }

  private async sendChangePasswordEmail(
    user: User,
    changePasswordRequestId: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: this.configService.smtpFrom,
        subject: 'Troca de senha',
        template: 'change-password',
        context: {
          name: user.name,
          urlTrocaSenha: this.configService.getChangePasswordFrontUrl(
            changePasswordRequestId,
          ),
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
