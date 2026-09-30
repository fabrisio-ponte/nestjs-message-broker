import { Injectable } from '@nestjs/common';

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
  handleTask(payload: TaskPayload): void {
    console.log('WorkService received payload:', payload);

    switch (payload.current_step) {
      case TaskStep.ASSIGNMENT_NEW_WORK:
        console.log('Routing to ASSIGNMENT_NEW_WORK handler');
        console.log('New work assigned:', payload);
        break;

      case TaskStep.STATUS_UPDATE:
        console.log('Routing to STATUS_UPDATE handler');
        console.log('Status update received:', payload);
        break;

      case TaskStep.ASSIGNMENT_REASSIGN:
        console.log('Routing to ASSIGNMENT_REASSIGN handler');
        console.log('Work reassigned:', payload);
        break;

      default:
        console.log('Unknown step, falling back to default handler');
        console.log('Unhandled payload:', payload);
        break;
    }
  }
}
