import { Token, Transaction, Transfer } from '../aggregate';

export class TransferIndexedEvent {
  constructor(
    readonly transfer: Transfer,
    readonly chainId: string,
    readonly transaction: Transaction,
    readonly token: Token | null,
  ) {}
}
