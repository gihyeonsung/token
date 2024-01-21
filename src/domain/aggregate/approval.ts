import { Address } from '../value';
import { Base } from './base';

export class Approval extends Base {
  readonly transactionId: string;
  readonly ownerAddress: Address;
  readonly spenderAddress: Address;
  private tokenId: string | null;
  private instanceId: string | null;
  readonly amount: bigint;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    transactionId: string,
    tokenId: string | null,
    instanceId: string | null,
    ownerAddress: Address,
    spenderAddress: Address,
    amount: bigint,
  ) {
    super(id, createdAt, updatedAt);

    this.transactionId = transactionId;
    this.tokenId = tokenId;
    this.instanceId = instanceId;
    this.ownerAddress = ownerAddress;
    this.spenderAddress = spenderAddress;
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
