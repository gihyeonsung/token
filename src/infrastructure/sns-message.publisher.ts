import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { MessagePublisher } from '../application';
import { Message } from '../domain';

import { MessageSerializer } from './message.serializer';

export class SnsMessagePublisher implements MessagePublisher {
  constructor(
    private readonly snsClient: SNSClient,
    private readonly snsTopicArn: string,
    private readonly messageSerializer: MessageSerializer,
  ) {}

  async publish(message: Message): Promise<void> {
    await this.snsClient.send(
      new PublishCommand({ TopicArn: this.snsTopicArn, Message: this.messageSerializer.toString(message) }),
    );
  }
}
