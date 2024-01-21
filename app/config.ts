export type Config = {
  chains: {
    standardId: number;
    httpJsonRpcUrl: string;
    websocketJsonRpcUrl: string;
  }[];
  api: {
    host: string;
    port: number;
  };
  ipfsGateway: {
    baseUrl: string;
  };
  messaging: {
    awsSnsTopicArn: string;
    queues: {
      name: string;
      awsSqsQueueUrl: string;
    }[];
  };
};
