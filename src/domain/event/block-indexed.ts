import { Block } from '../aggregate';

export class BlockIndexedEvent {
  constructor(
    readonly blockId: string,
    readonly block: Block,
    readonly transactionHashes: string[],
  ) {}
}
