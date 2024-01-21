import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

import { BlockRepository } from '../../application';
import { Block } from '../../domain';

export class PrismaBlockRepository implements BlockRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  nextId(): string {
    return randomUUID();
  }

  async findOneById(id: string): Promise<Block | null> {
    const dalEntity = await this.prismaClient.block.findFirst({ where: { id } });
    if (dalEntity === null) {
      return null;
    }
    return new Block(
      dalEntity.id,
      dalEntity.createdAt,
      dalEntity.updatedAt,
      dalEntity.chainId,
      dalEntity.number,
      dalEntity.hash,
      dalEntity.timestamp,
    );
  }

  async save(aggregate: Block): Promise<void> {
    const dalEntity = {
      id: aggregate.id,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.getUpdatedAt(),
      chainId: aggregate.chainId,
      number: aggregate.number,
      hash: aggregate.hash,
      timestamp: aggregate.timestamp,
    };
    await this.prismaClient.block.upsert({
      where: { id: dalEntity.id },
      create: dalEntity,
      update: dalEntity,
    });
  }

  async findOneLatest(chainId: string): Promise<Block | null> {
    const dalEntity = await this.prismaClient.block.findFirst({ where: { chainId }, orderBy: { number: 'desc' } });
    if (dalEntity === null) {
      return null;
    }
    return new Block(
      dalEntity.id,
      dalEntity.createdAt,
      dalEntity.updatedAt,
      dalEntity.chainId,
      dalEntity.number,
      dalEntity.hash,
      dalEntity.timestamp,
    );
  }
}
