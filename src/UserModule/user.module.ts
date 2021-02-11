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
import { SqsModule } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';

const SQS = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-2' });

@Module({
  imports: [
    CacheModule.register(),
    SqsModule.register({
      consumers: [],
      producers: [
        {
          batchSize: 1,
          name: 'userRewardCompleteRegistration',
          queueUrl: process.env.USER_REWARD_COMPLETE_REGISTRATION_QUEUE_URL,
          region: 'us-east-2',
          sqs: SQS,
        },
      ],
    }),
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
