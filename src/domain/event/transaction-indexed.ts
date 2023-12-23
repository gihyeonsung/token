import { Block, Chain, Transaction } from '../aggregate';

export class TransactionIndexedEvent {
  constructor(
    readonly transactionId: string,
    readonly chain: Chain,
    readonly block: Block,
    readonly transaction: Transaction,
  ) {}
}
