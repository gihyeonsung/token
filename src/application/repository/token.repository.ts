import { Token } from '../../domain';

import { GenericRepository } from './generic.repository';

export interface TokenRepository extends GenericRepository<Token> {
  findOneByAddress(chainId: string, address: string): Promise<Token | null>;
}
