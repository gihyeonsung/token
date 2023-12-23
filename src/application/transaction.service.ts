import { BlockIndexedEvent, Transaction, TransactionIndexedEvent } from '../domain';
import { TokenIndexedEvent } from '../domain/event/token-indexed';

import { MessagePublisher } from './message.publisher';
import { NetworkConnector } from './network.connector';
import { TransactionRepository } from './transaction.repository';

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly messagePublisher: MessagePublisher,
    private readonly networkConnector: NetworkConnector,
  ) {}

  // TODO: block -> transaction -> transfer 등으로 넘어가면 하나의 상위 이벤트가 너무 많은 내부 이벤트를 만드는게 아닌지?
  async handleBlockIndexedEvent(event: BlockIndexedEvent) {
    const { block, chain } = event;
    for (const transactionHash of event.transactionHashes) {
      const receipt = await this.networkConnector.fetchTransactionReceipt(chain.standardId, transactionHash);
      if (receipt === null) {
        throw new Error(`transaction receipt not found`);
      }

      const now = new Date();
      const transaction = new Transaction(
        this.transactionRepository.nextId(),
        now,
        now,
        block.id,
        transactionHash,
        receipt.index,
        receipt.from,
        receipt.to,
        receipt.logs,
      );
      await this.transactionRepository.save(transaction);

      await this.messagePublisher.publish(new TransactionIndexedEvent(transaction.id, chain, block, transaction));
    }
  }

  async handleTokenIndexedEvent(event: TokenIndexedEvent) {
    const { token } = event;

    // TODO: 해당 토큰을 가진 transfer 들의 tokenId 채워주기
  }
}
