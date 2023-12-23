import { Token } from '../aggregate';

export class TokenIndexedEvent {
  constructor(readonly token: Token) {}
}
