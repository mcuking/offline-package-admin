import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as path from 'path';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import config from './common/config';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 防止跨站脚本攻击
  app.use(helmet());

  // app.useGlobalPipes(new ValidationPipe());

  // 统一封装接口异常时返回数据
  app.useGlobalFilters(new HttpExceptionFilter());
  // 统一封装接口成功时返回数据
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useStaticAssets(path.join(__dirname, '..', 'packages'), {
    index: false,
    prefix: config.publicPath,
  });

  const options = new DocumentBuilder()
    .setTitle('离线包 API 文档')
    .setDescription('离线包 API 描述')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  global.__basedir = path.join(__dirname, '..');
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
