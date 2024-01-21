import { Chain } from '../../domain';

import { ChainRepository } from '../repository';

export class ChainService {
  constructor(private readonly chainRepository: ChainRepository) {}

  async findByStandardIdOrCreate(standardIds: number[]): Promise<Chain[]> {
    const chains: Chain[] = [];
    for (const standardId of standardIds) {
      let chain = await this.chainRepository.findOneByStandardId(standardId);
      if (chain === null) {
        const now = new Date();
        chain = new Chain(this.chainRepository.nextId(), now, now, standardId);
        await this.chainRepository.save(chain);
      }
      chains.push(chain);
    }
    return chains;
  }
}
