import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { MessagePublisher } from '../application';

export class SqsMessagePublisher implements MessagePublisher {
  private readonly sqsClient: SQSClient;

  constructor(
    private readonly sqsClientRegion: string,
    private readonly sqsQueueUrl: string,
  ) {
    this.sqsClient = new SQSClient({ region: this.sqsClientRegion });
  }

  async publish(message: any): Promise<void> {
    const command = new SendMessageCommand({ QueueUrl: this.sqsQueueUrl, MessageBody: message });

    // TODO: transactional outbox
    await this.sqsClient.send(command);
  }
}
