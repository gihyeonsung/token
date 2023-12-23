import { isLowerHexString } from '../utils';
import { Base } from './base';

// TODO: 블럭, 트랜잭션, 전송은 생명 주기가 일치한다. 일관적으로 수정할 필요는 없으나 이것을 aggregate로 묶는건 타당할까?
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
