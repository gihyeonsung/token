import { BlockIndexedEvent, IndexTransactionCommand, Log, Transaction, TransactionIndexedEvent } from '../../domain';

import { Logger } from '../logger';
import { MessagePublisher } from '../message.publisher';
import { MessageSubscriber } from '../message.subscriber';
import { NetworkConnector } from '../network.connector';
import { TransactionRepository } from '../repository';

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly networkConnector: NetworkConnector,
    private readonly messageSubscriber: MessageSubscriber,
    private readonly messagePublisher: MessagePublisher,
    private readonly logger: Logger,
  ) {
    this.messageSubscriber.on('INDEX_TRANSACTIONS', this.indexTransactions.bind(this));
    this.messageSubscriber.on('INDEX_TRANSACTION', this.indexTransaction.bind(this));
  }

  async indexTransactions(event: BlockIndexedEvent) {
    const { block, transactionHashes } = event;

    const chainId = block.chainId;
    const blockId = block.id;
    for (const transactionHash of transactionHashes) {
      await this.messagePublisher.publish(new IndexTransactionCommand(chainId, blockId, transactionHash));
    }
  }

  async indexTransaction(event: IndexTransactionCommand) {
    const { chainId, blockId, transactionHash } = event;

    const receipt = await this.networkConnector.fetchTransactionReceiptByHash(chainId, transactionHash);
    if (receipt === null) {
      throw new Error(`transaction receipt not found`);
    }

    // TODO: factory 등으로 생성 간소화
    // TODO: trasaction.log의 id 생성을 어떤식으로 하는게 좋을지 고려
    const now = new Date();
    const transactionId = this.transactionRepository.nextId();
    const transaction = new Transaction(
      transactionId,
      now,
      now,
      blockId,
      receipt.hash,
      receipt.index,
      receipt.from,
      receipt.to,
      receipt.logs.map(
        (l) =>
          new Log(
            this.transactionRepository.nextId(),
            now,
            now,
            blockId,
            transactionId,
            l.index,
            l.address,
            l.topics.at(0) ?? null,
            l.topics.at(1) ?? null,
            l.topics.at(2) ?? null,
            l.topics.at(3) ?? null,
            l.data,
          ),
      ),
    );

    await this.transactionRepository.save(transaction);
    await this.messagePublisher.publish(new TransactionIndexedEvent(transaction.id, chainId));

    this.logger.info('transaction indexed', transaction.hash);
  }
}
