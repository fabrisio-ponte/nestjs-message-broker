import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WorkService } from './work.service';

@Controller()
export class WorkRmqController {
  constructor(private readonly workService: WorkService) {}

  @EventPattern('inbound.task.assignment')
  async handleInboundTask(@Payload() payload: any) {
    await this.workService.handleTask(payload);
  }

  @EventPattern('inbound.task.assignment.completed')
  handleCompletedTask(@Payload() payload: any) {
    console.log('Completed task event received by downstream consumer:', payload);
  }
}
