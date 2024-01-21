import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { Handler, MessageSubscriber } from '../../application';

import { MessageSerializer } from './message.serializer';

export class SqsMessageSubscriber implements MessageSubscriber {
  private readonly handlers: Map<string, Handler> = new Map();

  constructor(
    private readonly awsSqsClient: SQSClient,
    private readonly queues: { name: string; awsSqsQueueUrl: string }[],
    private readonly messageSerializer: MessageSerializer,
  ) {}

  on(name: string, handler: Handler): void {
    if (this.handlers.has(name)) {
      throw new Error('multiple handler on the same queue is disallowed');
    }
    this.handlers.set(name, handler);
  }

  private async listenOne(name: string, sqsQueueUrl: string): Promise<void> {
    while (true) {
      const response = await this.awsSqsClient.send(
        new ReceiveMessageCommand({ QueueUrl: sqsQueueUrl, MaxNumberOfMessages: 1, WaitTimeSeconds: 10 }),
      );
      if (!response.Messages || response.Messages.length !== 1) {
        continue;
      }

      const message = response.Messages[0];
      const messageBody = message.Body;
      if (!messageBody) {
        continue;
      }

      const handler = this.handlers.get(name);
      if (handler) {
        await handler(this.messageSerializer.toMessage(messageBody));
      }

      await this.awsSqsClient.send(
        new DeleteMessageCommand({ QueueUrl: sqsQueueUrl, ReceiptHandle: message.ReceiptHandle }),
      );
    }
  }

  async listen(): Promise<void> {
    await Promise.all(
      this.queues.map(async (q) => {
        await this.listenOne(q.name, q.awsSqsQueueUrl);
      }),
    );
  }
}
