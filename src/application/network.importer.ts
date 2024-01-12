import { IndexBlockCommand } from '../domain';

import { MessagePublisher } from './message.publisher';
import { NetworkConnector } from './network.connector';

export class NetworkImporter {
  constructor(
    private readonly networkConnector: NetworkConnector,
    private readonly messagePublisher: MessagePublisher,
  ) {}

  async initialize(): Promise<void> {
    await this.networkConnector.onNewBlockNumber(async (event) => {
      const command = new IndexBlockCommand(event.chainId, event.blockNumber);
      await this.messagePublisher.publish(command);
    });
  }
}
