import {
  InstanceIndexedEvent,
  TokenIndexedEvent,
  TransactionIndexedEvent,
  Transfer,
  TransferIndexedEvent,
  decodeEvent,
} from '../domain';

import { InstanceRepository } from './instance.repository';
import { Logger } from './logger';
import { MessagePublisher } from './message.publisher';
import { MessageSubscriber } from './message.subscriber';
import { TokenRepository } from './token.repository';
import { TransactionRepository } from './transaction.repository';
import { TransferRepository } from './transfer.repository';

export class TransferService {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly instanceRepository: InstanceRepository,
    private readonly messageSubscriber: MessageSubscriber,
    private readonly messagePublisher: MessagePublisher,
    private readonly logger: Logger,
  ) {
    this.messageSubscriber.on('INDEX_TRANSFERS', this.indexTransfers.bind(this));
    this.messageSubscriber.on('SET_EMPTY_TOKEN_ID', this.setEmptyTokenId.bind(this));
    this.messageSubscriber.on('SET_EMPTY_INSTANCE_ID', this.setEmptyInstanceId.bind(this));
  }

  static readonly TOPIC_0_20_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  static readonly TOPIC_0_721_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  static readonly TOPIC_0_1155_TRANSFER_SINGLE = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62';
  static readonly TOPIC_0_1155_TRANSFER_BATCH = '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb';

  static readonly SIGNATURE_20_TRANSFER = 'event Transfer(address indexed, address indexed, uint256)';
  static readonly SIGNATURE_721_TRANSFER = 'event Transfer(address indexed, address indexed, uint256 indexed)';
  static readonly SIGNATURE_1155_TRANSFER_SINGLE =
    'event TransferSingle(address indexed, address indexed, address indexed, uint256, uint256)';
  static readonly SIGNATURE_1155_TRANSFER_BATCH =
    'event TransferBatch(address indexed, address indexed, address indexed, uint256[], uint256[])';

  static extractTransferValues(
    topics: string[],
    data: string,
  ): { from: string; to: string; amount: bigint; index: string | null }[] {
    if (topics.length === 3 && topics[0] === this.TOPIC_0_20_TRANSFER) {
      const args = decodeEvent<[string, string, bigint]>(this.SIGNATURE_20_TRANSFER, topics, data);
      if (args === null) {
        throw new Error('expected decoding 20 transfer, but not decoded');
      }
      return [{ from: args[0], to: args[1], amount: args[2], index: null }];
    }

    if (topics.length === 4 && topics[0] === this.TOPIC_0_721_TRANSFER) {
      const args = decodeEvent<[string, string, bigint]>(this.SIGNATURE_721_TRANSFER, topics, data);
      if (args === null) {
        throw new Error('expected decoding 721 transfer, but not decoded');
      }
      return [{ from: args[0], to: args[1], amount: 1n, index: args[2].toString() }];
    }

    if (topics.length === 4 && topics[0] === this.TOPIC_0_1155_TRANSFER_SINGLE) {
      const args = decodeEvent<[string, string, string, bigint, bigint]>(
        this.SIGNATURE_1155_TRANSFER_SINGLE,
        topics,
        data,
      );
      if (args === null) {
        throw new Error('expected decoding 1155 single transfer, but not decoded');
      }
      return [{ from: args[1], to: args[2], amount: args[4], index: args[3].toString() }];
    }

    if (topics.length === 4 && topics[0] === this.TOPIC_0_1155_TRANSFER_BATCH) {
      const args = decodeEvent<[string, string, string, bigint[], bigint[]]>(
        this.SIGNATURE_1155_TRANSFER_BATCH,
        topics,
        data,
      );
      if (args === null) {
        throw new Error('expected decoding 1155 batch transfer, but not decoded');
      }
      if (args[3].length !== args[4].length) {
        throw new Error('expected the same length of ids and amounts, but not matching');
      }
      const values = [];
      const from = args[1];
      const to = args[2];
      for (let i = 0; i < args[3].length; i++) {
        const amount = args[4][i];
        const index = args[3][i].toString();
        values.push({ from, to, amount, index });
      }
      return values;
    }

    return [];
  }

  // TODO: ExtractTransferCommand 여러개를 발행해서 나눠 처리하는식으로 해야할듯
  async indexTransfers(event: TransactionIndexedEvent) {
    const { chainId, transactionId } = event;
    const transaction = await this.transactionRepository.findOneById(transactionId);
    if (transaction === null) {
      throw new Error('got transaction indexed event, but not found');
    }

    for (const log of transaction.logs) {
      const tokenAddress = log.address;
      const token = await this.tokenRepository.findOneByAddress(chainId, tokenAddress);
      const tokenId = token?.id ?? null;

      const topics = [log.topic0, log.topic1, log.topic2, log.topic3].filter((t): t is string => typeof t === 'string');
      const transferValues = TransferService.extractTransferValues(topics, log.data);

      for (const transferValue of transferValues) {
        const now = new Date();

        let instanceId: string | null = null;
        if (tokenId && transferValue.index) {
          const instance = await this.instanceRepository.findOneByTokenIdAndIndex(tokenId, transferValue.index);
          instanceId = instance?.id ?? null;
        }

        const transfer = new Transfer(
          this.transferRepository.nextId(),
          now,
          now,
          transaction.id,
          tokenId,
          instanceId,
          transferValue.from,
          transferValue.to,
          transferValue.amount,
        );

        await this.transferRepository.save(transfer);
        await this.messagePublisher.publish(new TransferIndexedEvent(chainId, transfer.id, tokenAddress));

        this.logger.info('transfer indexed', transaction.hash, transfer.fromAddress, transfer.toAddress);
      }
    }
  }

  async setEmptyTokenId(event: TokenIndexedEvent) {
    const { token, transferIdTriggered } = event;

    const transfer = await this.transferRepository.findOneById(transferIdTriggered);
    if (transfer === null) {
      throw new Error('token indexed triggered by transfer indexing, but the transfer not found');
    }

    if (transfer.getTokenId()) {
      return;
    }

    transfer.setTokenId(token.id);
    await this.transferRepository.save(transfer);

    this.logger.info('transfer token id set', transfer.id);
  }

  async setEmptyInstanceId(event: InstanceIndexedEvent) {
    const { instance, transferTriggered } = event;

    const transfer = await this.transferRepository.findOneById(transferTriggered.id);
    if (transfer === null) {
      throw new Error('instance indexed triggered by transfer indexing, but the transfer not found');
    }

    if (transfer.getInstanceId()) {
      return;
    }

    transfer.setInstanceId(instance.id);
    await this.transferRepository.save(transfer);

    this.logger.info('transfer instance id set', transfer.id);
  }
}
