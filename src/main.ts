import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'] as string[],
      queue: 'task-routing.inbound',
      queueOptions: {
        durable: true,
      },
      noAck: false,
      prefetchCount: 1,
    } as any,
  } as any);

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('HTTP server listening on http://localhost:3000');
}

bootstrap();
