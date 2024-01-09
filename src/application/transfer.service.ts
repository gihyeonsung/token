import { Instance, TransactionIndexedEvent, Log, Transfer, TransferIndexedEvent } from '../domain';

import { MessagePublisher } from './message.publisher';
import { TokenService } from './token.service';
import { TransferRepository } from './transfer.repository';
import { InstanceRepository } from './instance.repository';
import { TokenRepository } from './token.repository';

export class TransferService {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly messagePublisher: MessagePublisher,
    private readonly tokenRepository: TokenRepository,
    private readonly instanceRepository: InstanceRepository,
  ) {}

  static tryParseLog(log: Log): { fromAddress: string; toAddress: string; amount: bigint; index: bigint | null }[] {
    // TODO: impl
    // const tokenType = TokenService.detectTokenTypeFromLogTopics(log.topics);
    const tokenType = null;
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
    const { block, transaction } = event;
    const chainId = block.chainId;

    for (const log of event.transaction.logs) {
      const token = await this.tokenRepository.findOneByAddress(chainId, log.address);
      const parsedData = TransferService.tryParseLog(log);

      for (const data of parsedData) {
        const now = new Date();

        let instance: Instance | null = null;
        if (data.index !== null && token !== null) {
          instance = await this.instanceRepository.findOneByTokenIdAndIndex(token.id, data.index);
        }

        const transfer = new Transfer(
          this.transferRepository.nextId(),
          now,
          now,
          token?.id ?? null, // 이후 TokenService에서 채워줌
          transaction.id,
          log.index,
          data.fromAddress,
          data.toAddress,
          data.amount,
          instance?.id ?? null, // 이후 InstanceService에서 채워줌
        );
        await this.transferRepository.save(transfer);
        await this.messagePublisher.publish(new TransferIndexedEvent(transfer, chainId, transaction, token));
      }
    }
  }
}
