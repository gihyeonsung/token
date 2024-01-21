import { PrismaClient, Chain as ChainDalEntity, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

import { ChainRepository } from '../application';
import { Chain } from '../domain';

export class PrismaChainRepository implements ChainRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  private static toDalEntity(aggregate: Chain): ChainDalEntity {
    return {
      id: aggregate.id,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.getUpdatedAt(),
      standardId: aggregate.standardId,
    };
  }

  private static toAggregate(dalEntity: ChainDalEntity): Chain {
    return new Chain(dalEntity.id, dalEntity.createdAt, dalEntity.updatedAt, dalEntity.standardId);
  }

  nextId(): string {
    return randomUUID();
  }

  async findOrderByStandardId(
    limit: number,
    cursor?: string | undefined,
  ): Promise<{ items: Chain[]; cursorNext?: string | undefined }> {
    const dalEntites = await this.prismaClient.chain.findMany({ orderBy: { standardId: 'asc' } });
    const aggregates = dalEntites.map(PrismaChainRepository.toAggregate);
    return { items: aggregates };
  }

  async findOneById(id: string): Promise<Chain | null> {
    const dalEntity = await this.prismaClient.chain.findFirst({ where: { id } });
    if (dalEntity === null) {
      return null;
    }
    return PrismaChainRepository.toAggregate(dalEntity);
  }

  async save(aggregate: Chain): Promise<void> {
    const dalEntity = PrismaChainRepository.toDalEntity(aggregate);
    await this.prismaClient.chain.upsert({
      where: { id: dalEntity.id },
      create: dalEntity,
      update: dalEntity,
    });
  }

  async findOneByStandardId(standardId: number): Promise<Chain | null> {
    const dalEntity = await this.prismaClient.chain.findFirst({ where: { standardId } });
    if (dalEntity === null) {
      return null;
    }
    return PrismaChainRepository.toAggregate(dalEntity);
  }
}
