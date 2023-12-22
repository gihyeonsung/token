import { Transaction, TransactionIndexedEvent } from '../domain';

import { MessagePublisher } from './message.publisher';
import { TransferRepository } from './transfer.repository';

export class TransferService {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly messagePublisher: MessagePublisher,
  ) {}

  // TODO: block -> transaction -> transfer 등으로 넘어가면 하나의 상위 이벤트가 너무 많은 내부 이벤트를 만드는게 아닌지?
  async handleTransactionIndexed(event: TransactionIndexedEvent) {
    const transactionId = event.transactionId;
  }
}
