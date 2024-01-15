import { Token, Transaction, Transfer } from '../aggregate';

export class TransferIndexedEvent {
  static TOPIC = TransferIndexedEvent.name;

  readonly topic = TransferIndexedEvent.TOPIC;

  constructor(
    readonly transfer: Transfer,
    readonly chainId: string,
    readonly transaction: Transaction,
    readonly token: Token | null,
  ) {}
}
