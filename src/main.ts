import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService as ConfigService } from './ConfigModule/service/app-config.service';

async function bootstrap() {
  // const pwd = securePassword();
  //
  // const userPassword = Buffer.from('123456');
  //
  // const result = await pwd.verify(
  //   userPassword,
  //   Buffer.from(
  //     'fdbc339b12fc9b2be9090a1f52262acc4f0baf897e25ad00ddc871a8b619a7a673eeded5256371f78367b902f5801e558209c4119fb1550d5c1abbe3d54ed10b',
  //   ),
  // );
  //
  // console.log(result);

  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('@Security/Authorization-Resource-Server')
    .setDescription('Authorization e Resource Server da NewSchool')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const appConfigService = app.get<ConfigService>(ConfigService);

  await app.listen(appConfigService.port || 8080);
}
bootstrap();
