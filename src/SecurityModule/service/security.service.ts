import { GrantTypeEnum } from '../enum/grant-type.enum';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientCredentials, User, Role, Policy } from '@prisma/client';
import * as Sentry from '@sentry/node';
import { InvalidClientCredentialsError } from '../exception/invalid-client-credentials.error';
import { classToPlain } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { FacebookAuthUserDTO } from '../dto/facebook-auth-user.dto';
import { ClientCredentialsRepository } from '../repository/client-credentials.repository';
import { GeneratedTokenDTO } from '../dto/generated-token.dto';
import { GoogleAuthUserDTO } from '../dto/google-auth-user.dto';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { ErrorObject } from '../../CommonsModule/dto/error-object.dto';
import { UserService } from '../../UserModule/service/user.service';
import SecurePassword from 'secure-password';
import { UserMapper } from '../../UserModule/mapper/user.mapper';
import { UserDTO } from '../../UserModule/dto/user.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const securePassword = require('secure-password');

interface GenerateLoginObjectOptions {
  accessTokenValidity: number;
  refreshTokenValidity?: number;
}

@Injectable()
export class SecurityService {
  constructor(
    private readonly clientCredentialsRepository: ClientCredentialsRepository,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly userMapper: UserMapper,
  ) {}

  hashPaths = {
    [securePassword.INVALID]: async () => {
      throw new NotFoundException(
        new ErrorObject('USER_NOT_FOUND').customMessage(
          'User with this username or password not found',
        ),
      );
    },
    [securePassword.VALID_NEEDS_REHASH]: async ({ user, password }) => {
      return await this.userService.hashUserPassword(user, password);
    },
    [securePassword.VALID]: async ({ user }) => {
      return user;
    },
  };

  public async validateClientCredentials(
    base64Login: string,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = SecurityService.splitClientCredentials(
      SecurityService.base64ToString(base64Login),
    );
    const clientCredentials: ClientCredentials = await this.findClientCredentialsByNameAndSecret(
      name,
      secret,
      GrantTypeEnum.CLIENT_CREDENTIALS,
    );
    return this.generateLoginObject(clientCredentials, {
      accessTokenValidity: clientCredentials.accessTokenValidity,
    });
  }

  public decodeToken(jwt: string): ClientCredentials | User {
    return this.jwtService.verify<ClientCredentials | User>(jwt);
  }

  private static splitClientCredentials(login: string): string[] {
    return login.split(':');
  }

  private static base64ToString(base64Login: string): string {
    return Buffer.from(base64Login, 'base64').toString('ascii');
  }

  public async validateUserCredentials(
    base64Login: string,
    username: string,
    password: string,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = SecurityService.splitClientCredentials(
      SecurityService.base64ToString(base64Login),
    );
    const clientCredentials = await this.findClientCredentialsByNameAndSecret(
      name,
      secret,
      GrantTypeEnum.PASSWORD,
    );
    const user = await this.userService.findByUsername(username);
    const result = await this.validPassword(user.password, password);

    const updatedUser = await this.hashPaths[result]({ user, password });

    return this.generateLoginObject(this.userMapper.toDto(updatedUser), {
      accessTokenValidity: clientCredentials.accessTokenValidity,
      refreshTokenValidity: clientCredentials.refreshTokenValidity,
    });
  }

  public async validateFacebookUser(
    base64Login: string,
    facebookAuthUser: FacebookAuthUserDTO,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = SecurityService.splitClientCredentials(
      SecurityService.base64ToString(base64Login),
    );
    const clientCredentials = await this.findClientCredentialsByNameAndSecret(
      name,
      secret,
      GrantTypeEnum.PASSWORD,
    );
    const user = await this.userService.findByUsername(
      facebookAuthUser.username,
    );
    if (!user.facebookId) {
      user.facebookId = facebookAuthUser.id;
      const { Role, ...userInfo } = user;
      const userWithFacebookId: User = await this.userService.update(user.id, {
        ...userInfo,
        roleName: Role.name,
      });
      return this.generateLoginObject(
        this.userMapper.toDto(userWithFacebookId),
        {
          accessTokenValidity: clientCredentials.accessTokenValidity,
          refreshTokenValidity: clientCredentials.refreshTokenValidity,
        },
      );
    }
    if (user.facebookId !== facebookAuthUser.id) {
      throw new NotFoundException('User not found');
    }
    return this.generateLoginObject(this.userMapper.toDto(user), {
      accessTokenValidity: clientCredentials.accessTokenValidity,
      refreshTokenValidity: clientCredentials.refreshTokenValidity,
    });
  }

  public async validateGoogleUser(
    base64Login: string,
    googleAuthUser: GoogleAuthUserDTO,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = SecurityService.splitClientCredentials(
      SecurityService.base64ToString(base64Login),
    );
    const clientCredentials = await this.findClientCredentialsByNameAndSecret(
      name,
      secret,
      GrantTypeEnum.PASSWORD,
    );
    const user = await this.userService.findByUsername(googleAuthUser.username);
    if (!user.googleSub) {
      user.googleSub = googleAuthUser.sub;
      const { Role, ...userInfo } = user;
      const userWithGoogleSub: User = await this.userService.update(user.id, {
        ...userInfo,
        roleName: Role.name,
      });
      return this.generateLoginObject(
        this.userMapper.toDto(userWithGoogleSub),
        {
          accessTokenValidity: clientCredentials.accessTokenValidity,
          refreshTokenValidity: clientCredentials.refreshTokenValidity,
        },
      );
    }
    if (user.googleSub !== googleAuthUser.sub) {
      throw new NotFoundException(new ErrorObject('USER_NOT_FOUND'));
    }
    return this.generateLoginObject(this.userMapper.toDto(user), {
      accessTokenValidity: clientCredentials.accessTokenValidity,
      refreshTokenValidity: clientCredentials.refreshTokenValidity,
    });
  }

  public async refreshToken(
    base64Login: string,
    refreshToken: string,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = SecurityService.splitClientCredentials(
      SecurityService.base64ToString(base64Login),
    );
    const clientCredentials = await this.findClientCredentialsByNameAndSecret(
      name,
      secret,
      GrantTypeEnum.REFRESH_TOKEN,
    );
    let refreshTokenUser: User & { Role: Role & { Policies: Policy[] } };
    try {
      refreshTokenUser = this.getUserFromToken(
        refreshToken,
        this.configService.refreshTokenSecret,
      );
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh Token expired');
      }
      throw new UnauthorizedException();
    }
    const user = await this.userService.findByUsername(
      refreshTokenUser.username,
    );
    return this.generateLoginObject(this.userMapper.toDto(user), {
      accessTokenValidity: clientCredentials.accessTokenValidity,
      refreshTokenValidity: clientCredentials.refreshTokenValidity,
    });
  }

  public getUserFromToken(
    jwt: string,
    secret: string,
  ): User & { Role: Role & { Policies: Policy[] } } {
    return this.jwtService.verify<
      User & { Role: Role & { Policies: Policy[] } }
    >(jwt, {
      secret,
    });
  }

  private generateLoginObject(
    authenticatedUser: ClientCredentials | UserDTO,
    { accessTokenValidity, refreshTokenValidity }: GenerateLoginObjectOptions,
  ): GeneratedTokenDTO {
    const { Role, ...user } = classToPlain(authenticatedUser);
    const { Policies, ...role } = Role;
    let loginObject: GeneratedTokenDTO = {
      accessToken: this.jwtService.sign(
        classToPlain({ ...user, role: { ...role, policies: Policies } }),
        {
          expiresIn: accessTokenValidity,
          secret: this.configService.jwtSecret,
        },
      ),
      tokenType: 'bearer',
      expiresIn: accessTokenValidity,
    };
    if (refreshTokenValidity) {
      loginObject = {
        ...loginObject,
        refreshToken: this.jwtService.sign(classToPlain(authenticatedUser), {
          expiresIn: refreshTokenValidity,
          secret: this.configService.refreshTokenSecret,
        }),
      };
    }
    return loginObject;
  }

  private async findClientCredentialsByNameAndSecret(
    name: string,
    secret: string,
    grantType: GrantTypeEnum,
  ): Promise<ClientCredentials> {
    if (!name) {
      throw new InvalidClientCredentialsError();
    }
    const clientCredentials = await this.clientCredentialsRepository.findByNameAndSecret(
      name,
      secret,
    );
    if (
      !clientCredentials ||
      !this.separateGrantTypes(clientCredentials.authorizedGrantTypes).includes(
        grantType,
      )
    ) {
      throw new InvalidClientCredentialsError();
    }
    return clientCredentials;
  }

  private separateGrantTypes(grantTypeString: string): string[] {
    return grantTypeString.split(',').filter((grantType) => grantType);
  }

  public async validPassword(userPassword: string, comparePassword: string) {
    const pwd: SecurePassword = securePassword();
    return pwd.verify(Buffer.from(comparePassword), Buffer.from(userPassword));
  }

  public static async validPassword(
    userPassword: string,
    comparePassword: string,
  ) {
    const pwd: SecurePassword = securePassword();
    return pwd.verify(Buffer.from(comparePassword), Buffer.from(userPassword));
  }
}
