import { ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { MessageSubscriber, Subscriber } from '../application';

export class SqsMessageSubscriber implements MessageSubscriber {
  private readonly sqsClient: SQSClient;
  private subscriber: Subscriber | null = null;

  constructor(private readonly sqsQueueUrl: string) {
    this.sqsClient = new SQSClient({});
  }

  async listen(): Promise<void> {
    const command = new ReceiveMessageCommand({ QueueUrl: this.sqsQueueUrl, WaitTimeSeconds: 0 });
    const response = await this.sqsClient.send(command);
    response.Messages;
  }

  subscribe(subscriber: Subscriber): void {
    this.subscriber = subscriber;
  }
}
