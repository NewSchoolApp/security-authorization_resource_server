import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigModule } from './ConfigModule/config.module';
import { AppConfigService as ConfigService } from './ConfigModule/service/app-config.service';
import { UserModule } from './UserModule/user.module';
import { SecurityModule } from './SecurityModule/security.module';
import { MailerAsyncOptions } from '@nest-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { MailerModule } from '@nest-modules/mailer';
import { PrismaModule } from './PrismaModule/prisma.module';

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
    MailerModule.forRootAsync(mailerAsyncModule),
    PrismaModule,
    SecurityModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
