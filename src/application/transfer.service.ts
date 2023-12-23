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

  static readonly TOPIC_20_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  static readonly TOPIC_721_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  static readonly TOPIC_1155_TRANSFER_SINGLE = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62';
  static readonly TOPIC_1155_TRANSFER_BATCH = '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb';

  static tryParseLog(
    log: TransactionLog,
  ): { fromAddress: string; toAddress: string; amount: bigint; instanceId: string | null }[] {
    if (log.topics.length === 3 && log.topics[0] === this.TOPIC_20_TRANSFER) {
      return [];
    }
    if (log.topics.length === 4 && log.topics[0] === this.TOPIC_721_TRANSFER) {
      return [];
    }
    if (log.topics.length === 4 && log.topics[0] === this.TOPIC_1155_TRANSFER_SINGLE) {
      return [];
    }
    if (log.topics.length === 4 && log.topics[0] === this.TOPIC_1155_TRANSFER_BATCH) {
      return [];
    }
    return [];
  }

  // TODO: block -> transaction -> transfer 등으로 넘어가면 하나의 상위 이벤트가 너무 많은 내부 이벤트를 만드는게 아닌지?
  async handleTransactionIndexed(event: TransactionIndexedEvent) {
    const chainId = event.chain.id;
    const blockId = event.block.id;
    const transactionId = event.transactionId;
    for (const log of event.transaction.logs) {
      const token = await this.tokenService.findOneByAddress(chainId, log.address);
      const parsedData = TransferService.tryParseLog(log);
      for (const data of parsedData) {
        const now = new Date();
        const transfer = new Transfer(
          this.transferRepository.nextId(),
          now,
          now,
          token?.id ?? null, // 이후 TokenService에서 채워줌
          blockId,
          transactionId,
          log.index,
          data.fromAddress,
          data.toAddress,
          data.amount,
          data.instanceId,
        );
        await this.transferRepository.save(transfer);
        await this.messagePublisher.publish(new TransferIndexedEvent(transfer));
      }
    }
  }
}
