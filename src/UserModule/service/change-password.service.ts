import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangePasswordRepository } from '../repository/change-password.repository';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly repository: ChangePasswordRepository,
    private readonly configService: ConfigService,
  ) {}

  public async createChangePasswordRequest(userId: string) {
    return this.repository.create({
      data: {
        userId,
        expirationTimeInMilliseconds: this.configService
          .changePasswordExpirationTime,
      },
    });
  }

  public async findById(id: string) {
    const changePassword = await this.repository.findUnique({
      where: { id },
      include: { User: true },
    });
    if (!changePassword) {
      throw new NotFoundException();
    }
    return changePassword;
  }
}
