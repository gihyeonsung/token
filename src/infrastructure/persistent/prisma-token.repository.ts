import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

import { TokenRepository } from '../../application';
import { Token, TokenType } from '../../domain';

export class PrismaTokenRepository implements TokenRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  nextId(): string {
    return randomUUID();
  }

  async findOneById(id: string): Promise<Token | null> {
    const dalEntity = await this.prismaClient.token.findFirst({ where: { id } });
    if (dalEntity === null) {
      return null;
    }
    return new Token(
      dalEntity.id,
      dalEntity.createdAt,
      dalEntity.updatedAt,
      dalEntity.chainId,
      dalEntity.address,
      dalEntity.type as TokenType,
      dalEntity.name,
      dalEntity.symbol,
      dalEntity.decimals,
      dalEntity.totalSupply ? BigInt(dalEntity.totalSupply.toFixed()) : null,
      dalEntity.totalSupplyUpdatedAt,
    );
  }

  async save(aggregate: Token): Promise<void> {
    const dalEntity = {
      id: aggregate.id,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.getUpdatedAt(),
      chainId: aggregate.chainId,
      address: aggregate.address,
      type: aggregate.type,
      name: aggregate.getName(),
      symbol: aggregate.getSymbol(),
      decimals: aggregate.getDecimals(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      totalSupply: aggregate.getTotalSupply() ? new Prisma.Decimal(aggregate.getTotalSupply()?.toString()!) : null,
      totalSupplyUpdatedAt: aggregate.getTotalSupplyUpdatedat(),
    };
    await this.prismaClient.token.upsert({
      where: { id: dalEntity.id },
      create: dalEntity,
      update: dalEntity,
    });
  }

  async findOneByAddress(chainId: string, address: string): Promise<Token | null> {
    const dalEntity = await this.prismaClient.token.findFirst({ where: { chainId, address } });
    if (dalEntity === null) {
      return null;
    }
    return new Token(
      dalEntity.id,
      dalEntity.createdAt,
      dalEntity.updatedAt,
      dalEntity.chainId,
      dalEntity.address,
      dalEntity.type as TokenType,
      dalEntity.name,
      dalEntity.symbol,
      dalEntity.decimals,
      dalEntity.totalSupply ? BigInt(dalEntity.totalSupply.toFixed()) : null,
      dalEntity.totalSupplyUpdatedAt,
    );
  }
}
