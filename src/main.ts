import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app)

  const config = new DocumentBuilder()
    .setTitle('Order Management System API')
    .setDescription('API for the Backend internship task for Slash')
    .setVersion('1.0')
    .addTag('cart')
    .addTag('orders')
    .addTag('users')
    .addTag('products')
    .addTag('coupons')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
