import { isLowerAddress } from '../utils';
import { Base } from './base';

export class Transfer extends Base {
  /// 전송었으나, 처음보는 경우 null
  private readonly tokenId: string | null;
  private readonly blockId: string;
  private readonly transactionId: string;
  private readonly logIndex: number;
  private readonly fromAddress: string;
  private readonly toAddress: string;
  private readonly value: bigint;
  private readonly instanceId: string | null;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    tokenId: string,
    blockId: string,
    transactionId: string,
    logIndex: number,
    fromAddress: string,
    toAddress: string,
    value: bigint,
    instanceId: string | null,
  ) {
    super(id, createdAt, updatedAt);

    // TODO: token 종류에 따라 instanceId가 nullable 한지가 결정되는데, 입력받은 것으로는 하기 어려운데;
    if (false) throw new Error('instanceId must be set when token is not ERC-20');
    if (!isLowerAddress(fromAddress)) throw new Error('fromAddress must be lower address');
    if (!isLowerAddress(toAddress)) throw new Error('toAddress must be lower address');

    this.tokenId = tokenId;
    this.blockId = blockId;
    this.transactionId = transactionId;
    this.logIndex = logIndex;
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.value = value;
    this.instanceId = instanceId;
  }
}
