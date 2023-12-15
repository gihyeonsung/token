export class BlockImported {
  constructor(
    readonly chainId: number,
    readonly number: number,
    readonly hash: string,
    readonly timestamp: number,
  ) {}
}
