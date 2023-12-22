export class BlockIndexedEvent {
  constructor(
    readonly chainId: number,
    readonly number: number,
    readonly hash: string,
    readonly timestamp: number,
    readonly blockId: string,
    readonly transactionHashes: string[],
  ) {}
}
