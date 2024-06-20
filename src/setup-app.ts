import { ValidationPipe } from "@nestjs/common";

export const setupApp = (app: any) => {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};
