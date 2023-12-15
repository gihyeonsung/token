import { WebSocketProvider } from 'ethers';

import { EthersNetworkConnectorNewBlockEvent, NetworkConnector, NetworkConnectorHandler } from '../application';

export class EthersNetworkConnector implements NetworkConnector {
  private readonly provider: WebSocketProvider;

  constructor(private readonly providerUrl: string) {
    this.provider = new WebSocketProvider(this.providerUrl);
  }

  async onNewBlock(handler: NetworkConnectorHandler<EthersNetworkConnectorNewBlockEvent>): Promise<void> {
    await this.provider.on('block', async (blockNumber) => {
      if (typeof blockNumber !== 'number') {
        console.log('got unexpected provider event', blockNumber);
        return;
      }

      const block = await this.provider.getBlock(blockNumber);
      if (block === null) {
        console.log('new block reconiged, but failed to fetch');
        return;
      }

      if (block.hash === null) {
        console.log('new block body fetched, but no hash');
        return;
      }

      const event = { chainId: 1, number: block.number, hash: block.hash, timestamp: block.timestamp };
      await handler(event);
    });
  }

  call(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
