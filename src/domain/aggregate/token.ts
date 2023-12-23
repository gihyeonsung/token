import { Base } from './base';

export type TokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155';

export class Token extends Base {
  private readonly address: string;
  private type: TokenType | null;
  private name: string | null;
  private symbol: string | null;
  private decimals: number | null;
  private totalSupply: bigint | null;
  private totalSupplyUpdatedAtBlockId: string | null;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    address: string,
    type: TokenType | null,
    name: string | null,
    symbol: string | null,
    decimals: number | null,
    totalSupply: bigint | null,
    totalSupplyUpdatedAtBlockId: string | null,
  ) {
    super(id, createdAt, updatedAt);

    // TODO
    if (false) throw new Error('totalSupply and its updated block timestamp must be set at once');

    this.address = address;
    this.type = type;
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
    this.totalSupply = totalSupply;
    this.totalSupplyUpdatedAtBlockId = totalSupplyUpdatedAtBlockId;
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
  updateTotalSupply(totalSupply: bigint, totalSupplyUpdatedAtBlockId: number) {
    if (this.totalSupply === null && this.totalSupplyUpdatedAtBlockId == null) {
      this.totalSupply = totalSupply;
      this.totalSupplyUpdatedAtBlockId;
      return;
    }

    // TODO
    // if (this.totalSupplyUpdatedAtBlockId != null && this.totalSupplyUpdatedAtBlockId > totalSupplyUpdatedAtBlockId) {
    //   this.totalSupply = totalSupply;
    //   this.totalSupplyUpdatedAtBlockId;
    // }
  }
}
