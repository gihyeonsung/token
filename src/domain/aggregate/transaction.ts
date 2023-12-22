import { isLowerHexString } from '../utils';
import { Base } from './base';

export class Transaction extends Base {
  private readonly blockId: string;
  private readonly hash: string;

  constructor(id: string, createdAt: Date, updatedAt: Date, blockId: string, hash: string) {
    super(id, createdAt, updatedAt);

    if (!isLowerHexString(hash, 66)) throw new Error('hash must be lower hex string');

    this.blockId = blockId;
    this.hash = hash;
  }
}
