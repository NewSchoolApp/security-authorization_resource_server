import { Module } from '@nestjs/common';
import { ChangePasswordRepository } from './repository/change-password.repository';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserMapper } from './mapper/user.mapper';
import { ChangePasswordService } from './service/change-password.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserMapper,
    UserService,
    UserRepository,
    ChangePasswordService,
    ChangePasswordRepository,
  ],
  exports: [UserService, UserMapper],
})
export class UserModule {}
