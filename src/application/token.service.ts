import { Block, Token, TokenType, TransferIndexedEvent } from '../domain';
import { TokenIndexedEvent } from '../domain/event/token-indexed';
import { BlockRepository } from './block.repository';
import { MessagePublisher } from './message.publisher';
import { NetworkConnector } from './network.connector';
import { TokenRepository } from './token.repository';

export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly networkConnector: NetworkConnector,
    private readonly messagePublisher: MessagePublisher,
    private readonly blockRepository: BlockRepository,
  ) {}

  static readonly TOPIC_20_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  static readonly TOPIC_721_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  static readonly TOPIC_1155_TRANSFER_SINGLE = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62';
  static readonly TOPIC_1155_TRANSFER_BATCH = '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb';

  static detectTokenTypeFromLogTopics(topics: string[]): TokenType | null {
    if (topics.length === 3 && topics[0] === this.TOPIC_20_TRANSFER) {
      return 'ERC-20';
    }
    if (topics.length === 4 && topics[0] === this.TOPIC_721_TRANSFER) {
      return 'ERC-721';
    }
    if (topics.length === 4 && topics[0] === this.TOPIC_1155_TRANSFER_SINGLE) {
      return 'ERC-1155';
    }
    if (topics.length === 4 && topics[0] === this.TOPIC_1155_TRANSFER_BATCH) {
      return 'ERC-1155';
    }
    return null;
  }

  async handleTransferIndexedEvent(event: TransferIndexedEvent): Promise<void> {
    const { chainId, transaction, transfer } = event;
    if (transfer.tokenId !== null) {
      return;
    }

    const now = new Date();

    const tokenAddress = transaction.toAddress;

    const transactionLog = transaction.logs.at(transfer.logIndex) ?? null;
    if (transactionLog === null) {
      throw new Error('transfer event log not found');
    }
    const tokenType = TokenService.detectTokenTypeFromLogTopics(transactionLog.topics);

    const block = await this.blockRepository.findOneLatest(chainId);
    if (block === null) {
      throw new Error('transfer indexed but block not found');
    }
    const tokenMetadata = await this.fetchTokenMetadata(chainId, block, tokenAddress);

    const token = new Token(
      this.tokenRepository.nextId(),
      now,
      now,
      tokenAddress,
      tokenType,
      tokenMetadata.name,
      tokenMetadata.symbol,
      tokenMetadata.decimals,
      tokenMetadata.totalSupply,
      tokenMetadata.totalSupplyUpdatedAtBlockId,
    );

    await this.tokenRepository.save(token);
    await this.messagePublisher.publish(new TokenIndexedEvent(token));
  }

  async fetchTokenMetadata(
    chainId: string,
    block: Block,
    address: string,
  ): Promise<{
    name: string | null;
    symbol: string | null;
    decimals: number | null;
    totalSupply: bigint | null;
    totalSupplyUpdatedAtBlockId: string | null;
  }> {
    const context = { chainId, blockHash: block.hash, address };
    const [name] = await this.networkConnector.call<[string]>({
      ...context,
      functionSignature: 'function name() returns (string)',
    });
    const [symbol] = await this.networkConnector.call<[string]>({
      ...context,
      functionSignature: 'function symbol() returns (string)',
    });
    const [decimals] = await this.networkConnector.call<[bigint]>({
      ...context,
      functionSignature: 'function decimals() returns (uint8)',
    });
    const [totalSupply] = await this.networkConnector.call<[bigint]>({
      ...context,
      functionSignature: 'function totalSupply() returns (uint8)',
    });
    return { name, symbol, decimals: Number(decimals), totalSupply, totalSupplyUpdatedAtBlockId: block.id };
  }
}
