import { Token, TransferIndexedEvent } from '../domain';
import { TokenRepository } from './token.repository';

export class TokenService {
  constructor(private readonly tokenRepository: TokenRepository) {}

  /// 1. 처음보는 토큰이면, 새로 받아와 저장 + 해당 transfer의 tokenId 업데이트..를 여기서 하는게 맞나?
  /// 2.
  async handleTransferIndexedEvent(event: TransferIndexedEvent): Promise<void> {
    const { transfer } = event;
  }

  async findOneByAddress(chainId: string, address: string): Promise<Token | null> {
    return await this.tokenRepository.findOneByAddress(chainId, address);
  }
}
