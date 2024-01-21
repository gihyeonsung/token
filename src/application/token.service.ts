import { Token, TokenIndexedEvent, TransferIndexedEvent } from '../domain';

import { Logger } from './logger';
import { MessagePublisher } from './message.publisher';
import { MessageSubscriber } from './message.subscriber';
import { NetworkConnector } from './network.connector';
import { TokenRepository } from './token.repository';
import { TransferRepository } from './transfer.repository';

export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly transferRepository: TransferRepository,
    private readonly networkConnector: NetworkConnector,
    private readonly messageSubscriber: MessageSubscriber,
    private readonly messagePublisher: MessagePublisher,
    private readonly logger: Logger,
  ) {
    this.messageSubscriber.on('INDEX_TOKEN', this.indexToken.bind(this));
  }

  async indexToken(event: TransferIndexedEvent): Promise<void> {
    const { chainId, transferId, tokenAddress } = event;
    const tokenFound = await this.tokenRepository.findOneByAddress(chainId, tokenAddress);
    if (tokenFound !== null) {
      return;
    }

    const now = new Date();
    const address = tokenAddress;

    const id = this.tokenRepository.nextId();
    const name = await this.fetchName(chainId, address);
    const symbol = await this.fetchSymbol(chainId, address);
    const decimals = await this.fetchDecimals(chainId, address);
    const totalSupply = await this.fetchTotalSupply(chainId, address);
    const token = new Token(id, now, now, chainId, address, null, name, symbol, decimals, totalSupply, now);

    await this.tokenRepository.save(token);
    await this.messagePublisher.publish(new TokenIndexedEvent(token, transferId));

    this.logger.info('token indexed', token.address, token.getSymbol());
  }

  // TODO: retry client
  async fetchName(chainId: string, address: string): Promise<string | null> {
    const context = { chainId, address };
    try {
      const name = await this.networkConnector.call<string>({
        ...context,
        functionSignature: 'function name() view returns (string)',
      });
      return name;
    } catch {
      return null;
    }
  }

  async fetchSymbol(chainId: string, address: string): Promise<string | null> {
    const context = { chainId, address };
    try {
      const symbol = await this.networkConnector.call<string>({
        ...context,
        functionSignature: 'function symbol() view returns (string)',
      });
      return symbol;
    } catch {
      return null;
    }
  }

  async fetchDecimals(chainId: string, address: string): Promise<number | null> {
    const context = { chainId, address };
    try {
      const decimals = await this.networkConnector.call<bigint>({
        ...context,
        functionSignature: 'function decimals() view returns (uint8)',
      });
      return Number(decimals);
    } catch {
      return null;
    }
  }

  async fetchTotalSupply(chainId: string, address: string): Promise<bigint | null> {
    const context = { chainId, address };
    try {
      const totalSupply = await this.networkConnector.call<bigint>({
        ...context,
        functionSignature: 'function totalSupply() view returns (uint256)',
      });
      return totalSupply;
    } catch {
      return null;
    }
  }
}
