import { Base } from './base';

export class Transfer extends Base {
  tokenId: string;
  blockId: string;
  transactionId: string;
  logIndex: bigint;
  fromAddress: string;
  toAddress: string;
  value: bigint;
  id?: bigint;
}
