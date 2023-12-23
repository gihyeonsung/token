import { TransactionIndexedEvent, TransactionLog, Transfer, TransferIndexedEvent } from '../domain';

import { MessagePublisher } from './message.publisher';
import { TokenService } from './token.service';
import { TransferRepository } from './transfer.repository';

export class TransferService {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly messagePublisher: MessagePublisher,
    private readonly tokenService: TokenService,
  ) {}

  static tryParseLog(
    log: TransactionLog,
  ): { fromAddress: string; toAddress: string; amount: bigint; instanceId: string | null }[] {
    const tokenType = TokenService.detectTokenTypeFromLogTopics(log.topics);
    if (tokenType === null) {
      return [];
    }

    switch (tokenType) {
      case 'ERC-20':
      case 'ERC-721':
      case 'ERC-1155':
        break;

      default:
        break;
    }
    return [];
  }

  // TODO: block -> transaction -> transfer 등으로 넘어가면 하나의 상위 이벤트가 너무 많은 내부 이벤트를 만드는게 아닌지?
  async handleTransactionIndexed(event: TransactionIndexedEvent) {
    const { chain, block, transaction } = event;
    for (const log of event.transaction.logs) {
      const token = await this.tokenService.findOneByAddress(chain.id, log.address);
      const parsedData = TransferService.tryParseLog(log);
      for (const data of parsedData) {
        const now = new Date();
        const transfer = new Transfer(
          this.transferRepository.nextId(),
          now,
          now,
          token?.id ?? null, // 이후 TokenService에서 채워줌
          block.id,
          transaction.id,
          log.index,
          data.fromAddress,
          data.toAddress,
          data.amount,
          data.instanceId,
        );
        await this.transferRepository.save(transfer);
        await this.messagePublisher.publish(new TransferIndexedEvent(transfer, chain, transaction));
      }
    }
  }
}
