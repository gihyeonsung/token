import { Block, BlockIndexedEvent, IndexBlockCommand } from '../domain';

import { BlockRepository } from './block.repository';
import { MessagePublisher } from './message.publisher';
import { NetworkConnector } from './network.connector';

export class BlockService {
  constructor(
    private readonly networkConnector: NetworkConnector,
    private readonly blockRepository: BlockRepository,
    private readonly messagePublisher: MessagePublisher,
  ) {}

  async executeIndexBlockCommand(command: IndexBlockCommand): Promise<void> {
    const { chainId, blockNumber } = command;

    const blockMetadata = await this.networkConnector.fetchBlockByNumber(chainId, blockNumber);
    if (blockMetadata === null) {
      throw new Error('could not fetched block');
    }

    const now = new Date();
    const block = new Block(
      this.blockRepository.nextId(),
      now,
      now,
      chainId,
      blockMetadata.number,
      blockMetadata.hash,
      blockMetadata.timestamp,
    );
    await this.blockRepository.save(block);
    await this.messagePublisher.publish(new BlockIndexedEvent(block.id, block, blockMetadata.transactionHashes));
  }
}
