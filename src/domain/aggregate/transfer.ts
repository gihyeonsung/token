import { isLowerAddress } from '../utils';
import { Base } from './base';

export class Transfer extends Base {
  /// 무슨 토큰인지 모르고 색인된 경우 null
  readonly tokenId: string | null;
  readonly transactionId: string;
  readonly logIndex: number;
  readonly fromAddress: string;
  readonly toAddress: string;
  readonly amount: bigint;
  // ERC-721, ERC-1155만 값이 있음
  readonly instanceId: string | null;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    tokenId: string | null,
    transactionId: string,
    logIndex: number,
    fromAddress: string,
    toAddress: string,
    amount: bigint,
    instanceId: string | null,
  ) {
    super(id, createdAt, updatedAt);

    // TODO: token 종류에 따라 instanceId가 nullable 한지가 결정되는데, 입력받은 것으로는 하기 어려운데;
    if (false) throw new Error('instanceId must be set when token is not ERC-20');
    if (!isLowerAddress(fromAddress)) throw new Error('fromAddress must be lower address');
    if (!isLowerAddress(toAddress)) throw new Error('toAddress must be lower address');

    this.tokenId = tokenId;
    this.transactionId = transactionId;
    this.logIndex = logIndex;
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.instanceId = instanceId;
  }
}
