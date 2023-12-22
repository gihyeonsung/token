import { BlockIndexedEvent, Transaction, TransactionIndexedEvent } from '../domain';

import { MessagePublisher } from './message.publisher';
import { TransactionRepository } from './transaction.repository';

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly messagePublisher: MessagePublisher,
  ) {}

  // TODO: block -> transaction -> transfer 등으로 넘어가면 하나의 상위 이벤트가 너무 많은 내부 이벤트를 만드는게 아닌지?
  async handleBlockIndexedEvent(event: BlockIndexedEvent) {
    const blockId = event.blockId;
    for (const transactionHash of event.transactionHashes) {
      const now = new Date();
      const transaction = new Transaction(this.transactionRepository.nextId(), now, now, blockId, transactionHash);
      await this.transactionRepository.save(transaction);
      await this.messagePublisher.publish(new TransactionIndexedEvent(transaction.id));
    }
  }
}
