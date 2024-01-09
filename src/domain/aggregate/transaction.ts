import { isLowerAddress, isLowerHexString } from '../utils';
import { Base } from './base';

export class Log extends Base {
  readonly blockId: string;
  readonly transactionId: string;
  readonly index: number;
  readonly address: string;
  readonly topic0: string | null;
  readonly topic1: string | null;
  readonly topic2: string | null;
  readonly topic3: string | null;
  readonly data: string;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    blockId: string,
    transactionId: string,
    index: number,
    address: string,
    topic0: string | null,
    topic1: string | null,
    topic2: string | null,
    topic3: string | null,
    data: string,
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerAddress(address)) throw new Error('address must be lower address');
    if (!(topic0 !== null && isLowerHexString(topic0, 66))) throw new Error('topic0 must be null or lower hex string');
    if (!(topic1 !== null && isLowerHexString(topic1, 66))) throw new Error('topic1 must be null or lower hex string');
    if (!(topic2 !== null && isLowerHexString(topic2, 66))) throw new Error('topic2 must be null or lower hex string');
    if (!(topic3 !== null && isLowerHexString(topic3, 66))) throw new Error('topic3 must be null or lower hex string');
    if (!isLowerHexString(data)) throw new Error('data must be lower address');

    this.blockId = blockId;
    this.transactionId = transactionId;
    this.index = index;
    this.address = address;
    this.topic0 = topic0;
    this.topic1 = topic1;
    this.topic2 = topic2;
    this.topic3 = topic3;
    this.data = data;
  }
}

export class Transaction extends Base {
  readonly blockId: string;
  readonly hash: string;
  readonly index: number;
  readonly fromAddress: string;
  readonly toAddress: string;
  readonly logs: Log[];

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    blockId: string,
    hash: string,
    index: number,
    fromAddress: string,
    toAddress: string,
    logs: Log[],
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerHexString(hash, 66)) throw new Error('hash must be lower hex string');
    if (!isLowerAddress(fromAddress)) throw new Error('fromAddress must be lower address');
    if (!isLowerAddress(toAddress)) throw new Error('toAddress must be lower address');

    this.blockId = blockId;
    this.hash = hash;
    this.index = index;
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.logs = logs;
  }
}
