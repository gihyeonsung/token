import { Block, Token, TransferIndexedEvent } from '../domain';
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
    // TODO: 토큰의 종류를 식별하는 방법들로 타입을 식별하라
    // const tokenType = TransferService.extractTransferValues(transactionLog.topics);
    const tokenType = 'ERC-20';

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
