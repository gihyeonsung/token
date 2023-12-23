import { isLowerAddress, isLowerHexString } from '../utils';
import { Base } from './base';

export type TransactionLog = {
  index: number;
  address: string;
  topics: string[];
  data: string;
};

export class Transaction extends Base {
  private readonly blockId: string;
  private readonly hash: string;
  private readonly index: number;
  readonly logs: TransactionLog[];

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    blockId: string,
    hash: string,
    index: number,
    logs: TransactionLog[],
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerHexString(hash, 66)) throw new Error('hash must be lower hex string');
    if (!logs.every((l) => isLowerAddress(l.address))) throw new Error('log address must be lower address');
    if (!logs.every((l) => l.topics.every((t) => isLowerHexString(t, 66))))
      throw new Error('log topic must be lower hex string');

    this.blockId = blockId;
    this.hash = hash;
    this.index = index;
    this.logs = logs;
  }
}
