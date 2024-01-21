import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

import { TransferRepository } from '../../application';
import { Transfer } from '../../domain';

export class PrismaTransferRepository implements TransferRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  nextId(): string {
    return randomUUID();
  }

  async findOneById(id: string): Promise<Transfer | null> {
    const dalEntity = await this.prismaClient.transfer.findFirst({ where: { id } });
    if (dalEntity === null) {
      return null;
    }
    return new Transfer(
      dalEntity.id,
      dalEntity.createdAt,
      dalEntity.updatedAt,
      dalEntity.fromAddress,
      dalEntity.toAddress,
      dalEntity.transactionId,
      dalEntity.tokenId,
      dalEntity.instanceId,
      BigInt(dalEntity.amount.toFixed()),
    );
  }

  async save(aggregate: Transfer): Promise<void> {
    const dalEntity = {
      id: aggregate.id,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.getUpdatedAt(),
      transactionId: aggregate.transactionId,
      tokenId: aggregate.getTokenId(),
      instanceId: aggregate.getInstanceId(),
      fromAddress: aggregate.fromAddress,
      toAddress: aggregate.toAddress,
      amount: new Prisma.Decimal(aggregate.amount.toString()),
    };
    await this.prismaClient.transfer.upsert({
      where: { id: dalEntity.id },
      create: dalEntity,
      update: dalEntity,
    });
  }
}
