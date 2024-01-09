import { BlockIndexedEvent, Log, Transaction, TransactionIndexedEvent } from '../domain';
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
    const { block, transactionHashes } = event;
    const chainId = block.chainId;
    for (const transactionHash of transactionHashes) {
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
        block.id,
        transactionHash,
        receipt.index,
        receipt.from,
        receipt.to,
        receipt.logs.map(
          (l) =>
            new Log(
              this.transactionRepository.nextId(),
              now,
              now,
              block.id,
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
      await this.messagePublisher.publish(new TransactionIndexedEvent(transaction.id, block, transaction));
    }
  }

  async handleTokenIndexedEvent(event: TokenIndexedEvent) {
    const { token } = event;

    // TODO: 해당 토큰을 가진 transfer 들의 tokenId 채워주기
  }
}
