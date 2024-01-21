import { Address } from '../value';
import { Base } from './base';

export class Balance extends Base {
  readonly ownerAddress: Address;
  private tokenId: string | null;
  private instanceId: string | null;
  private amount: bigint;
  private amountUpdatedAt: Date;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    ownerAddress: Address,
    tokenId: string | null,
    instanceId: string | null,
    amount: bigint,
    amountUpdatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);

    this.ownerAddress = ownerAddress;
    this.tokenId = tokenId;
    this.instanceId = instanceId;
    this.amount = amount;
    this.amountUpdatedAt = amountUpdatedAt;
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

  getAmount = (): bigint => this.amount;

  updateAmount(amount: bigint, amountFetchedAt: Date): void {
    if (this.amountUpdatedAt.getTime() > amountFetchedAt.getTime()) {
      return;
    }

    this.amount = amount;
    this.amountUpdatedAt = new Date();
  }
}
