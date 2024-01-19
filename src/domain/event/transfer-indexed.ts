export class TransferIndexedEvent {
  static TOPIC = TransferIndexedEvent.name;

  readonly topic = TransferIndexedEvent.TOPIC;

  constructor(
    readonly chainId: string,
    readonly transferId: string,
    readonly tokenAddress: string,
  ) {}
}
