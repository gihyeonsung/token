import { isLowerAddress, isLowerHexString } from '../utils';
import { Base } from './base';

export type TransactionLog = {
  index: number;
  address: string;
  topics: string[];
  data: string;
};

export class Transaction extends Base {
  readonly blockId: string;
  readonly hash: string;
  readonly index: number;
  readonly fromAddress: string;
  readonly toAddress: string;
  readonly logs: TransactionLog[];

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    blockId: string,
    hash: string,
    index: number,
    fromAddress: string,
    toAddress: string,
    logs: TransactionLog[],
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerHexString(hash, 66)) throw new Error('hash must be lower hex string');
    if (!isLowerAddress(fromAddress)) throw new Error('fromAddress must be lower address');
    if (!isLowerHexString(toAddress, 66)) throw new Error('toAddress must be lower address');
    if (!logs.every((l) => isLowerAddress(l.address))) throw new Error('log address must be lower address');
    if (!logs.every((l) => l.topics.every((t) => isLowerHexString(t, 66))))
      throw new Error('log topic must be lower hex string');

    this.blockId = blockId;
    this.hash = hash;
    this.index = index;
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.logs = logs;
  }
}
