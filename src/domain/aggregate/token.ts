import { Base } from './base';

export type TokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155';

export class Token extends Base {
  readonly chainId: string;
  readonly address: string; //  TODO: selfdestruct
  readonly type: TokenType | null; // 필요한지 모르겠음
  private name: string | null;
  private symbol: string | null;
  private decimals: number | null;
  private totalSupply: bigint | null;
  private totalSupplyUpdatedAt: Date;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    chainId: string,
    address: string,
    type: TokenType | null,
    name: string | null,
    symbol: string | null,
    decimals: number | null,
    totalSupply: bigint | null,
    totalSupplyUpdatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);

    this.chainId = chainId;
    this.address = address;
    this.type = type;
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
    this.totalSupply = totalSupply;
    this.totalSupplyUpdatedAt = totalSupplyUpdatedAt;
  }

  getName(): string | null {
    return this.name;
  }

  getSymbol(): string | null {
    return this.symbol;
  }

  getDecimals(): number | null {
    return this.decimals;
  }

  getTotalSupply(): bigint | null {
    return this.totalSupply;
  }

  getTotalSupplyUpdatedat(): Date {
    return this.totalSupplyUpdatedAt;
  }

  setName(name: string) {
    this.name = name;
  }

  setSymbol(symbol: string) {
    this.symbol = symbol;
  }

  setDecimals(decimals: number) {
    this.decimals = decimals;
  }
}
