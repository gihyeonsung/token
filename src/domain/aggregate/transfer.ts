import { isLowerAddress } from '../utils';
import { Base } from './base';

export class Transfer extends Base {
  readonly transactionId: string;
  // 무슨 토큰인지 모르고 색인된 경우 null
  private tokenId: string | null;
  // ERC-721, ERC-1155만 값이 있음
  private instanceId: string | null;
  readonly fromAddress: string;
  readonly toAddress: string;
  readonly amount: bigint;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    transactionId: string,
    tokenId: string | null,
    instanceId: string | null,
    fromAddress: string,
    toAddress: string,
    amount: bigint,
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerAddress(fromAddress)) throw new Error('fromAddress must be lower address');
    if (!isLowerAddress(toAddress)) throw new Error('toAddress must be lower address');

    this.transactionId = transactionId;
    this.tokenId = tokenId;
    this.instanceId = instanceId;
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  getTokenId(): string | null {
    return this.tokenId;
  }

  setTokenId(tokenId: string): void {
    if (this.tokenId !== null) throw new Error('tokenId must be set once');

    this.tokenId = tokenId;
  }
  getInstanceId(): string | null {
    return this.instanceId;
  }

  setInstanceId(instanceId: string): void {
    if (this.instanceId !== null) throw new Error('instanceId must be set once');

    this.instanceId = instanceId;
  }
}
