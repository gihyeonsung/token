import { Base } from './base';

export type TokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155';

export class Token extends Base {
  address: string;
  type: TokenType;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: bigint;
}
