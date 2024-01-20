export type EthersNetworkConnectorNewBlockNumberEvent = {
  chainId: string;
  blockNumber: number;
};

export type Block = {
  hash: string;
  number: number;
  timestamp: number;
  transactionHashes: string[];
};

export type TransactionReceiptLog = {
  address: string;
  topics: string[];
  data: string;
  index: number;
};

export type TransactionReceipt = {
  index: number;
  from: string;
  to: string;
  logs: TransactionReceiptLog[];
};

export type NetworkConnectorHandler<Event> = (event: Event) => Promise<void>;

export interface NetworkConnector {
  onNewBlockNumber(handler: NetworkConnectorHandler<EthersNetworkConnectorNewBlockNumberEvent>): Promise<void>;
  fetchBlockByHash(chainId: string, blockHash: string | null): Promise<Block | null>;
  fetchBlockByNumber(chainId: string, blockNumber: number | null): Promise<Block | null>;
  fetchTransactionReceiptByHash(chainId: string, transactionHash: string): Promise<TransactionReceipt | null>;
  call<Outputs extends (bigint | string)[] | (bigint | string)>(args: {
    chainId: string;
    blockHash?: string;
    address: string;
    functionSignature: string;
    inputs?: (bigint | string | number)[];
  }): Promise<Outputs>;
}
