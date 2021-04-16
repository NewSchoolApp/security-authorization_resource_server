import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RoleService } from './service/role.service';
import { SecurityController } from './controller/security.controller';
import { SecurityService } from './service/security.service';
import { ClientCredentialsRepository } from './repository/client-credentials.repository';
import { UserModule } from '../UserModule/user.module';
import { RoleRepository } from './repository/role.repository';
import { UserService } from '../UserModule/service/user.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [SecurityController],
  providers: [
    SecurityService,
    RoleService,
    RoleRepository,
    ClientCredentialsRepository,
  ],
  exports: [SecurityService, RoleService, JwtModule],
})
export class SecurityModule {}
