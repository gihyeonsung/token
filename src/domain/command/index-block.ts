export class IndexBlockCommand {
  constructor(
    readonly chainId: string,
    readonly blockNumber: number,
  ) {}
}
