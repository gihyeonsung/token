import { ChainRepository } from '../application/chain.repository';
import { Chain } from '../domain';

export class PrismaChainRepository implements ChainRepository {
  nextId(): string {
    throw new Error('Method not implemented.');
  }
  findOneById(id: string): Promise<Chain | null> {
    throw new Error('Method not implemented.');
  }
  save(data: Chain): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
