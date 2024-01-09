import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { MessageSubscriber, Subscriber } from '../application';

export class SqsMessageSubscriber implements MessageSubscriber {
  private readonly sqsClient: SQSClient;
  private subscriber: Subscriber | null = null;

  constructor(private readonly sqsQueueUrl: string) {
    this.sqsClient = new SQSClient({});
  }

  async listen(): Promise<void> {
    while (true) {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.sqsQueueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
      });

      const response = await this.sqsClient.send(command);
      if (!response.Messages || response.Messages.length !== 1) {
        continue;
      }

      const message = response.Messages[0];
      if (this.subscriber) {
        await this.subscriber(JSON.parse(message.Body ?? 'null'));
      }

      await this.sqsClient.send(
        new DeleteMessageCommand({ QueueUrl: this.sqsQueueUrl, ReceiptHandle: message.ReceiptHandle }),
      );
    }
  }

  subscribe(subscriber: Subscriber): void {
    this.subscriber = subscriber;
  }
}
