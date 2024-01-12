import { Message } from '../domain';

export interface MessagePublisher {
  publish(message: Message): Promise<void>;
}
