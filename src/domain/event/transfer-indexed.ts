import { Transfer } from '../aggregate';

export class TransferIndexedEvent {
  constructor(readonly transfer: Transfer) {}
}
