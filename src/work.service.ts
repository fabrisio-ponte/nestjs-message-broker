import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export enum TaskStep {
  ASSIGNMENT_NEW_WORK = 'ASSIGNMENT_NEW_WORK',
  STATUS_UPDATE = 'STATUS_UPDATE',
  ASSIGNMENT_REASSIGN = 'ASSIGNMENT_REASSIGN',
}

export interface TaskPayload {
  current_step: TaskStep | string;
  task_id?: string;
  work_id?: string;
  worker_id?: string;
  message?: string;
  [key: string]: any;
}

@Injectable()
export class WorkService {
  constructor(
    @Inject('TASK_BROKER')
    private readonly client: ClientProxy,
  ) {}

  async handleTask(payload: TaskPayload): Promise<void> {
    console.log('WorkService received payload:', payload);

    let nextPayload: Record<string, any> | undefined;
    let nextStep: string | undefined;
    let nextEventPattern: string | undefined;

    switch (payload.current_step) {
      case TaskStep.ASSIGNMENT_NEW_WORK:
        console.log('Routing to ASSIGNMENT_NEW_WORK handler');
        nextStep = TaskStep.ASSIGNMENT_NEW_WORK;
        nextEventPattern = 'inbound.task.assignment.completed';
        nextPayload = {
          task_id: payload.task_id,
          work_id: payload.work_id,
          worker_id: payload.worker_id,
          status: 'new-assignment-created',
          source: 'assignment-processor',
          message: 'A new task was assigned and published downstream.',
        };
        break;

      case TaskStep.STATUS_UPDATE:
        console.log('Routing to STATUS_UPDATE handler');
        nextStep = TaskStep.STATUS_UPDATE;
        nextEventPattern = 'inbound.task.assignment.completed';
        nextPayload = {
          task_id: payload.task_id,
          status: 'status-updated',
          source: 'status-processor',
          message: 'Status update was processed and forwarded.',
        };
        break;

      case TaskStep.ASSIGNMENT_REASSIGN:
        console.log('Routing to ASSIGNMENT_REASSIGN handler');
        nextStep = TaskStep.ASSIGNMENT_REASSIGN;
        nextEventPattern = 'inbound.task.assignment.completed';
        nextPayload = {
          task_id: payload.task_id,
          work_id: payload.work_id,
          worker_id: payload.worker_id,
          status: 'reassigned',
          source: 'reassignment-processor',
          message: 'Reassignment workflow processed and forwarded.',
        };
        break;

      default:
        console.log('Unknown step, falling back to default handler');
        console.log('Unhandled payload:', payload);
        throw new Error(`Unsupported current_step: ${payload.current_step}`);
    }

    const messageContainer = {
      ...payload,
      next_step: nextStep,
      next_event_pattern: nextEventPattern,
      generated_payload: nextPayload,
      published_at: new Date().toISOString(),
    };

    console.log('Sending downstream message to queue:', messageContainer);

    await firstValueFrom(this.client.emit(nextEventPattern as string, messageContainer));
  }
}
