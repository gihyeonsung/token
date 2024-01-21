import { Message } from '../message';

export class IndexTransactionCommand implements Message {
  static TOPIC = IndexTransactionCommand.name;

  readonly topic = IndexTransactionCommand.TOPIC;

  constructor(
    readonly chainId: string,
    readonly blockId: string,
    readonly transactionHash: string,
  ) {}
}
