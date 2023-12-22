export type EthersNetworkConnectorNewBlockEvent = {
  chainId: number;
  number: number;
  hash: string;
  timestamp: number;
};

export type NetworkConnectorHandler<Event> = (event: Event) => Promise<void>;

export interface NetworkConnector {
  onNewBlock(handler: NetworkConnectorHandler<EthersNetworkConnectorNewBlockEvent>): Promise<void>;
  fetchBlock(chainId: number, blockHash: string): Promise<any>;
  fetchTransactionReceipt(chainId: number, blockHash: string | null): Promise<any>;
  call(chainId: number, blockHash: string | null): Promise<any>;
}
