export type Config = {
  chains: {
    standardId: number;
    websocketJsonRpcUrl: string;
  }[];
  ipfsGateway: {
    baseUrl: string;
  };
  awsSqsQueueUrl: string;
};
