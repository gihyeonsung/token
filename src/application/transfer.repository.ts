import { Transfer } from '../domain';

import { GenericRepository } from './generic.repository';

export interface TransferRepository extends GenericRepository<Transfer> {
  findByTokenId(tokenId: string | null): Promise<Transfer[]>;
  findByInstanceId(instanceId: string | null): Promise<Transfer[]>;
}
