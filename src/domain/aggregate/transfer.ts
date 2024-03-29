import { isLowerAddress } from '../utils';
import { Base } from './base';

export class Transfer extends Base {
  readonly transactionId: string;
  readonly fromAddress: string;
  readonly toAddress: string;
  private tokenId: string | null; // 무슨 토큰인지 모르고 색인된 경우 null
  private instanceId: string | null; // ERC-721, ERC-1155만 값이 있음
  readonly amount: bigint;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    transactionId: string,
    fromAddress: string,
    toAddress: string,
    tokenId: string | null,
    instanceId: string | null,
    amount: bigint,
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerAddress(fromAddress)) throw new Error('fromAddress must be lower address');
    if (!isLowerAddress(toAddress)) throw new Error('toAddress must be lower address');

    this.transactionId = transactionId;
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.tokenId = tokenId;
    this.instanceId = instanceId;
    this.amount = amount;
  }

  getTokenId = (): string | null => this.tokenId;

  setTokenId(tokenId: string): void {
    if (this.tokenId !== null) throw new Error('tokenId must be set once');

    this.tokenId = tokenId;
  }

  getInstanceId = (): string | null => this.instanceId;

  setInstanceId(instanceId: string): void {
    if (this.instanceId !== null) throw new Error('instanceId must be set once');

    this.instanceId = instanceId;
  }
}
