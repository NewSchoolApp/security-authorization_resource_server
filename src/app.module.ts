import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule } from './ConfigModule/config.module';
import { AppConfigService as ConfigService } from './ConfigModule/service/app-config.service';
import { UserModule } from './UserModule/user.module';
import { SecurityModule } from './SecurityModule/security.module';
import { UploadModule } from './UploadModule/upload.module';
import { MailerAsyncOptions } from '@nest-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { MailerModule } from '@nest-modules/mailer';
import { SqsModule } from '@ssut/nestjs-sqs';

const typeOrmAsyncModule: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (appConfigService: ConfigService) =>
    appConfigService.getDatabaseConfig(),
};

const mailerAsyncModule: MailerAsyncOptions = {
  useFactory: (appConfigService: ConfigService) =>
    appConfigService.getSmtpConfiguration(),
  imports: [ConfigModule],
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule,
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncModule),
    MailerModule.forRootAsync(mailerAsyncModule),
    UserModule,
    SecurityModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
