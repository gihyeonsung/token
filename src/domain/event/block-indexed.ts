import { Block, Chain } from '../aggregate';

export class BlockIndexedEvent {
  constructor(
    readonly blockId: string,
    readonly block: Block,
    readonly chain: Chain,
    readonly transactionHashes: string[],
  ) {}
}
