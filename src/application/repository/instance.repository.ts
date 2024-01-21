import { Instance } from '../../domain';

import { GenericRepository } from './generic.repository';

export interface InstanceRepository extends GenericRepository<Instance> {
  findOneByTokenIdAndIndex(tokenId: string, index: string): Promise<Instance | null>;
}
