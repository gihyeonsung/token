import { Block } from '../aggregate';
import { Message } from '../message';

export class BlockIndexedEvent implements Message {
  static TOPIC = BlockIndexedEvent.name;

  readonly topic = BlockIndexedEvent.TOPIC;

  constructor(
    readonly blockId: string,
    readonly block: Block,
    readonly transactionHashes: string[],
  ) {}
}
