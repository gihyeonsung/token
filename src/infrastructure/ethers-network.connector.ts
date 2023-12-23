import { WebSocketProvider, Block as EthersBlock, Contract } from 'ethers';
import {
  Block,
  EthersNetworkConnectorNewBlockNumberEvent,
  NetworkConnector,
  NetworkConnectorHandler,
  TransactionReceipt,
} from '../application';

export class EthersNetworkConnector implements NetworkConnector {
  constructor(private readonly providers: Map<string, WebSocketProvider>) {}

  private provider(chainId: string): WebSocketProvider {
    const provider = this.providers.get(chainId);
    if (provider === undefined) {
      throw new Error('provider not found');
    }
    return provider;
  }

  async onNewBlockNumber(handler: NetworkConnectorHandler<EthersNetworkConnectorNewBlockNumberEvent>): Promise<void> {
    for (const [chainId, provider] of this.providers.entries()) {
      await provider.on('block', async (blockNumber) => {
        if (typeof blockNumber !== 'number') {
          console.log('got unexpected provider event', blockNumber);
          return;
        }
        await handler({ chainId, blockNumber });
      });
    }
  }

  static parseEthersBlock(ethersBlock: EthersBlock): Block {
    if (ethersBlock.hash === null) {
      throw new Error('ethers block not has no hash');
    }

    return {
      number: ethersBlock.number,
      hash: ethersBlock.hash,
      timestamp: ethersBlock.timestamp,
      transactionHashes: ethersBlock.transactions.map((hash) => hash.toLowerCase()),
    };
  }

  async fetchBlockByHash(chainId: string, blockHash: string | null): Promise<Block | null> {
    const blockTag = blockHash ? blockHash : 'latest';
    const ethersBlock = await this.provider(chainId).getBlock(blockTag);
    if (ethersBlock === null) {
      return null;
    }
    return EthersNetworkConnector.parseEthersBlock(ethersBlock);
  }

  async fetchBlockByNumber(chainId: string, blockNumber: number | null): Promise<Block | null> {
    const blockTag = blockNumber ? blockNumber : 'latest';
    const ethersBlock = await this.provider(chainId).getBlock(blockTag);
    if (ethersBlock === null) {
      return null;
    }
    return EthersNetworkConnector.parseEthersBlock(ethersBlock);
  }

  async fetchTransactionReceiptByHash(chainId: string, transactionHash: string): Promise<TransactionReceipt | null> {
    const receipt = await this.provider(chainId).getTransactionReceipt(transactionHash);
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

  async call<Outputs extends (bigint | string)[]>(args: {
    chainId: string;
    blockHash?: string;
    address: string;
    functionSignature: string;
    inputs?: (bigint | string | number)[];
  }): Promise<Outputs> {
    const provider = this.provider(args.chainId);
    const contract = new Contract(args.address, [args.functionSignature], provider);
    const functionName = args.functionSignature.replace('function', '').trimStart().split('(')[0];

    const blockTag = args.blockHash ? args.blockHash : 'latest';
    const inputs = args.inputs ?? [];
    const outputs = await contract[functionName](...inputs, { blockTag });
    return outputs as Outputs;
  }
}
