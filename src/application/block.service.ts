import { BlockRepository } from './block.repository';

export class BlockService {
  constructor(private readonly blockRepository: BlockRepository) {}
}
