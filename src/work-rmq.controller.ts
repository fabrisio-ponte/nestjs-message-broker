import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WorkService } from './work.service';

@Controller()
export class WorkRmqController {
  constructor(private readonly workService: WorkService) {}

  @EventPattern('inbound.task.assignment')
  handleInboundTask(@Payload() payload: any) {
    this.workService.handleTask(payload);
  }
}
