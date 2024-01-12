import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

import { ChainRepository } from '../application';
import { Chain } from '../domain';

export class PrismaChainRepository implements ChainRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  nextId(): string {
    return randomUUID();
  }

  async findOneById(id: string): Promise<Chain | null> {
    const dalEntity = await this.prismaClient.chain.findFirst({ where: { id } });
    if (dalEntity === null) {
      return null;
    }
    return new Chain(dalEntity.id, dalEntity.createdAt, dalEntity.updatedAt, dalEntity.standardId);
  }

  async save(aggregate: Chain): Promise<void> {
    const dalEntity = {
      id: aggregate.id,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.getUpdatedAt(),
      standardId: aggregate.standardId,
    };
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
    return new Chain(dalEntity.id, dalEntity.createdAt, dalEntity.updatedAt, dalEntity.standardId);
  }
}
