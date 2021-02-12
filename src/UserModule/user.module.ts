import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { ChangePassword } from './entity/change-password.entity';
import { ChangePasswordRepository } from './repository/change-password.repository';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserMapper } from './mapper/user.mapper';
import { ChangePasswordService } from './service/change-password.service';
import { UploadModule } from '../UploadModule/upload.module';


@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([
      User,
      UserRepository,
      ChangePassword,
      ChangePasswordRepository,
    ]),
    HttpModule,
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper, ChangePasswordService],
  exports: [UserService, UserMapper],
})
export class UserModule {}
