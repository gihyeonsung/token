import { Chain, Transaction, Transfer } from '../aggregate';

export class TransferIndexedEvent {
  constructor(
    readonly transfer: Transfer,
    readonly chain: Chain,
    readonly transaction: Transaction,
  ) {}
}
