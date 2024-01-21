import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

import { InstanceRepository } from '../../application';
import { Instance } from '../../domain';

export class PrismaInstanceRepository implements InstanceRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  nextId(): string {
    return randomUUID();
  }

  async findOneById(id: string): Promise<Instance | null> {
    const dalEntity = await this.prismaClient.instance.findFirst({ where: { id } });
    if (dalEntity === null) {
      return null;
    }
    return new Instance(
      dalEntity.id,
      dalEntity.createdAt,
      dalEntity.updatedAt,
      dalEntity.tokenId,
      dalEntity.index,
      dalEntity.ownerAddress,
      dalEntity.uri,
      dalEntity.uriUpdatedAt,
      dalEntity.metadata,
      dalEntity.metadataUpdatedAt,
    );
  }

  async save(aggregate: Instance): Promise<void> {
    const dalEntity = {
      id: aggregate.id,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.getUpdatedAt(),
      tokenId: aggregate.tokenId,
      index: aggregate.index,
      ownerAddress: aggregate.getOwnerAddress(),
      uri: aggregate.getUri(),
      uriUpdatedAt: aggregate.getUriUpdatedAt(),
      metadata: aggregate.getMetadata(),
      metadataUpdatedAt: aggregate.getMetadataUpdatedAt(),
    };
    await this.prismaClient.instance.upsert({
      where: { id: dalEntity.id },
      create: dalEntity,
      update: dalEntity,
    });
  }

  async findOneByTokenIdAndIndex(tokenId: string, index: string): Promise<Instance | null> {
    const dalEntity = await this.prismaClient.instance.findFirst({ where: { tokenId, index } });
    if (dalEntity === null) {
      return null;
    }
    return new Instance(
      dalEntity.id,
      dalEntity.createdAt,
      dalEntity.updatedAt,
      dalEntity.tokenId,
      dalEntity.index,
      dalEntity.ownerAddress,
      dalEntity.uri,
      dalEntity.uriUpdatedAt,
      dalEntity.metadata,
      dalEntity.metadataUpdatedAt,
    );
  }
}
