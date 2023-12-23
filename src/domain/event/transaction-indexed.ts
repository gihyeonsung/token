import { Block, Transaction } from '../aggregate';

export class TransactionIndexedEvent {
  constructor(
    readonly transactionId: string,
    readonly block: Block,
    readonly transaction: Transaction,
  ) {}
}
