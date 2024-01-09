import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

import { Log, Transaction } from '../domain';
import { TransactionRepository } from '../application';

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  nextId(): string {
    return randomUUID();
  }

  async findOneById(id: string): Promise<Transaction | null> {
    const dalEntity = await this.prismaClient.transaction.findFirst({ where: { id }, include: { logs: true } });
    if (dalEntity === null) {
      return null;
    }
    return new Transaction(
      dalEntity.id,
      dalEntity.createdAt,
      dalEntity.updatedAt,
      dalEntity.blockId,
      dalEntity.hash,
      dalEntity.index,
      dalEntity.from,
      dalEntity.to,
      dalEntity.logs.map(
        (l) =>
          new Log(
            l.id,
            l.createdAt,
            l.updatedAt,
            l.blockId,
            l.transactionId,
            l.index,
            l.address,
            l.topic0,
            l.topic1,
            l.topic2,
            l.topic3,
            l.data,
          ),
      ),
    );
  }

  async save(aggregate: Transaction): Promise<void> {
    const dalEntityTransaction = {
      id: aggregate.id,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.getUpdatedAt(),
      blockId: aggregate.blockId,
      hash: aggregate.hash,
      index: aggregate.index,
      from: aggregate.fromAddress,
      to: aggregate.toAddress,
    };

    await this.prismaClient.$transaction(async (tx) => {
      await tx.transaction.upsert({
        create: dalEntityTransaction,
        update: dalEntityTransaction,
        where: { id: dalEntityTransaction.id },
      });
      for (const aggregateLog of aggregate.logs) {
        const dalEntityLog = {
          id: aggregateLog.id,
          createdAt: aggregateLog.createdAt,
          updatedAt: aggregateLog.getUpdatedAt(),
          blockId: aggregateLog.blockId,
          transactionId: aggregateLog.transactionId,
          index: aggregateLog.index,
          address: aggregateLog.address,
          topic0: aggregateLog.topic0,
          topic1: aggregateLog.topic1,
          topic2: aggregateLog.topic2,
          topic3: aggregateLog.topic3,
          data: aggregateLog.data,
        };
        await tx.log.upsert({ create: dalEntityLog, update: dalEntityLog, where: { id: dalEntityLog.id } });
      }
    });
  }
}
