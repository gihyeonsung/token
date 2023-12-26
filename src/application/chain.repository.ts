import { Chain } from '../domain';

import { GenericRepository } from './generic.repository';

export interface ChainRepository extends GenericRepository<Chain> {
  findOneByStandardId(standardId: number): Promise<Chain | null>;
}
