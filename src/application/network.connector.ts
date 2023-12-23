export type EthersNetworkConnectorNewBlockEvent = {
  chainId: number;
  number: number;
  hash: string;
  timestamp: number;
};

export type Log = {
  address: string;
  topics: string[];
  data: string;
  index: number;
};

export type TransactionReceipt = {
  index: number;
  logs: Log[];
};

export type NetworkConnectorHandler<Event> = (event: Event) => Promise<void>;

export interface NetworkConnector {
  onNewBlock(handler: NetworkConnectorHandler<EthersNetworkConnectorNewBlockEvent>): Promise<void>;
  fetchBlock(chainId: number, blockHash: string | null): Promise<any | null>;
  fetchTransactionReceipt(chainId: number, transactionHash: string): Promise<TransactionReceipt | null>;
  call(chainId: number, blockHash: string | null): Promise<any>;
}
