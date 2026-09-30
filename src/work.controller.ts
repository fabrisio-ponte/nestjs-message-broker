import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('work')
export class WorkController {
  constructor(
    @Inject('TASK_BROKER')
    private readonly client: ClientProxy,
  ) {}

  @Post('assign')
  async createTask(@Body() payload: any) {
    const message = {
      ...payload,
      source: 'http-controller',
      routed_at: new Date().toISOString(),
    };

    await this.client.emit('inbound.task.assignment', message).toPromise();

    return {
      success: true,
      queued: true,
      message,
    };
  }
}
