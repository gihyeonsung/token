import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { MessagePublisher } from '../application';
import { Message } from '../domain';

export class SnsMessagePublisher implements MessagePublisher {
  constructor(
    private readonly snsClient: SNSClient,
    private readonly snsTopicArn: string,
  ) {}

  async publish(message: Message): Promise<void> {
    await this.snsClient.send(new PublishCommand({ TopicArn: this.snsTopicArn, Message: JSON.stringify(message) }));
  }
}
