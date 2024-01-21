import { isLowerHexString } from '../utils';
import { Base } from './base';

export class Block extends Base {
  readonly chainId: string;
  readonly number: number;
  readonly hash: string;
  readonly timestamp: number;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    chainId: string,
    number: number,
    hash: string,
    timestamp: number,
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerHexString(hash, 66)) throw new Error('hash must be lower hex string');

    this.chainId = chainId;
    this.number = number;
    this.hash = hash;
    this.timestamp = timestamp;
  }
}
