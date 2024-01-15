import { Token } from '../aggregate';

export class TokenIndexedEvent {
  static TOPIC = TokenIndexedEvent.name;

  readonly topic = TokenIndexedEvent.TOPIC;

  constructor(readonly token: Token) {}
}
