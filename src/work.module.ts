import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WorkController } from './work.controller';
import { WorkRmqController } from './work-rmq.controller';
import { WorkService } from './work.service';

const rmqClientConfig: any = {
  name: 'TASK_BROKER',
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://guest:guest@localhost:5672'] as string[],
    queue: 'task-routing.inbound',
    queueOptions: {
      durable: true,
    },
    noAck: false,
    prefetchCount: 1,
  },
};

@Module({
  imports: [ClientsModule.register([rmqClientConfig])],
  controllers: [WorkController, WorkRmqController],
  providers: [WorkService],
})
export class WorkModule {}
