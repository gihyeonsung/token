import { Block } from '../domain';

import { GenericRepository } from './generic.repository';

export interface BlockRepository extends GenericRepository<Block> {
  findOneLatest(chainId: string): Promise<Block | null>;
}
