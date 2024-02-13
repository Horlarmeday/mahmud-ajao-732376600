import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validation.pipes';
import { Logger, LoggerService } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: LoggerService = new Logger();
  const port = process.env.PORT;
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidateInputPipe({
      forbidUnknownValues: false,
    }),
  );
  await app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
  });
}
bootstrap();
