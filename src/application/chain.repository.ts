import { Chain } from '../domain';

import { GenericRepository } from './generic.repository';

export interface ChainRepository extends GenericRepository<Chain> {
  findOrderByStandardId(limit: number, cursor?: string): Promise<{ items: Chain[]; cursorNext?: string }>;
  findOneByStandardId(standardId: number): Promise<Chain | null>;
}
