export type EthersNetworkConnectorNewBlockEvent = {
  chainId: number;
  number: number;
  hash: string;
  timestamp: number;
};

export type NetworkConnectorHandler<Event> = (event: Event) => Promise<void>;

export interface NetworkConnector {
  onNewBlock(handler: NetworkConnectorHandler<EthersNetworkConnectorNewBlockEvent>): Promise<void>;
  call(): Promise<void>;
}
