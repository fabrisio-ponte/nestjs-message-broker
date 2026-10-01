import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('work')
export class WorkController {
  constructor(
    @Inject('TASK_BROKER')
    private readonly client: ClientProxy,       // Injects a PRODUCER CLIENT that was registered in workmodule using clientmodule.register
  ) {}

  @Post('assign')
  async createTask(@Body() payload: any) {
    const message = {
      ...payload,
      source: 'http-controller',
      routed_at: new Date().toISOString(),
    };

    await this.client.emit('inbound.task.assignment', message).toPromise(); // Publish an event message with the routing key/pattern into RabbitMQ

    return {
      success: true,
      queued: true,
      message,
    };
  }
}
