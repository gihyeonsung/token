import { Message } from '../message';

export class IndexBlockCommand implements Message {
  static TOPIC = IndexBlockCommand.name;

  readonly topic = IndexBlockCommand.TOPIC;

  constructor(
    readonly chainId: string,
    readonly blockNumber: number,
  ) {}
}
