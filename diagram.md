# RabbitMQ Event Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as HTTP Client
    participant Controller as WorkController
    participant Broker as RabbitMQ
    participant Consumer as WorkRmqController
    participant Service as WorkService

    Client->>Controller: POST /work/assign
    Controller->>Controller: Build message container
    Controller->>Broker: emit('inbound.task.assignment', message)
    Broker-->>Consumer: Deliver event
    Consumer->>Service: handleTask(payload)
    Service->>Service: switch(payload.current_step)

    alt ASSIGNMENT_NEW_WORK
        Service-->>Service: log new assignment workflow
    else STATUS_UPDATE
        Service-->>Service: log status workflow
    else ASSIGNMENT_REASSIGN
        Service-->>Service: log reassignment workflow
    else default
        Service-->>Service: log unknown step
    end

    Controller-->>Client: { success: true, queued: true }
```

This is the event-driven flow:
- HTTP request enters the app
- controller emits an event to RabbitMQ
- RabbitMQ delivers the message to the consumer
- the service decides what to do based on `current_step`
