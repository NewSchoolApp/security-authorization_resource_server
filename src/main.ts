import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService as ConfigService } from './ConfigModule/service/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
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
