import { WebSocketProvider } from 'ethers';

import {
  EthersNetworkConnectorNewBlockEvent,
  NetworkConnector,
  NetworkConnectorHandler,
  TransactionReceipt,
} from '../application';

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

  async fetchBlock(chainId: number, blockHash: string | null): Promise<any | null> {
    return null;
  }

  async fetchTransactionReceipt(chainId: number, transactionHash: string): Promise<TransactionReceipt | null> {
    const receipt = await this.provider.getTransactionReceipt(transactionHash);
    if (receipt === null) {
      return null;
    }

    const to = receipt.to ?? receipt.contractAddress;
    if (to === null) {
      throw new Error('receipt fetched, but to address not found');
    }

    return {
      index: receipt.index,
      from: receipt.from.toLowerCase(),
      to: to.toLowerCase(),
      logs: receipt.logs.map((l) => ({
        address: l.address.toLowerCase(),
        topics: l.topics.map((t) => t.toLowerCase()),
        data: l.data.toLowerCase(),
        index: l.index,
      })),
    };
  }

  call(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
