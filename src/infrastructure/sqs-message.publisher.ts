import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { MessagePublisher } from '../application';

export class SqsMessagePublisher implements MessagePublisher {
  private readonly sqsClient: SQSClient;

  constructor(private readonly sqsQueueUrl: string) {
    this.sqsClient = new SQSClient({});
  }

  async publish(message: any): Promise<void> {
    const messageJson = JSON.stringify(message);
    const command = new SendMessageCommand({ QueueUrl: this.sqsQueueUrl, MessageBody: messageJson });

    // TODO: transactional outbox
    const response = await this.sqsClient.send(command);
    console.log(new Date(), 'sent', response.MessageId);
  }
}
