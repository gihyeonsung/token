import { Block } from '../domain';
import { BlockRepository } from './block.repository';

export class BlockService {
  constructor(private readonly blockRepository: BlockRepository) {}

  async getLatestBlock(chainId: string): Promise<Block | null> {
    return await this.blockRepository.findOneLatest(chainId);
  }
}
