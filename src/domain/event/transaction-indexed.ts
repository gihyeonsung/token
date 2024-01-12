import { Block, Transaction } from '../aggregate';
import { Message } from '../message';

export class TransactionIndexedEvent implements Message {
  static TOPIC = TransactionIndexedEvent.name;

  readonly topic = TransactionIndexedEvent.TOPIC;

  constructor(
    readonly transactionId: string,
    readonly block: Block,
    readonly transaction: Transaction,
  ) {}
}
