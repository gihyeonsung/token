import { MessageSubscriber, Subscriber } from '../application';

export class SqsMessageSubscriber implements MessageSubscriber {
  subscribe(subscriber: Subscriber): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
