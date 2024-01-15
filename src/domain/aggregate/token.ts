import { Base } from './base';

export type TokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155';

export class Token extends Base {
  readonly chainId: string;
  readonly address: string; //  TODO: selfdestruct
  readonly type: TokenType | null;
  private name: string | null;
  private symbol: string | null;
  private decimals: number | null;
  private totalSupply: bigint | null;
  private totalSupplyUpdatedAt: Date | null;

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
    totalSupplyUpdatedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt);

    // TODO
    if (false) throw new Error('totalSupply and its updated block timestamp must be set at once');

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

  getTotalSupplyUpdatedat(): Date | null {
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

  // TODO: 업데이트 조건에 안맞으면 던질까 조용히 리턴할까?
  updateTotalSupply(totalSupply: bigint, totalSupplyUpdatedAt: Date) {
    if (this.totalSupply === null && this.totalSupplyUpdatedAt == null) {
      this.totalSupply = totalSupply;
      this.totalSupplyUpdatedAt;
      return;
    }

    // TODO
    // if (this.totalSupplyUpdatedAtBlockId != null && this.totalSupplyUpdatedAtBlockId > totalSupplyUpdatedAtBlockId) {
    //   this.totalSupply = totalSupply;
    //   this.totalSupplyUpdatedAtBlockId;
    // }
  }
}
