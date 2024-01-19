export type Config = {
  chains: {
    standardId: number;
    httpJsonRpcUrl: string;
    websocketJsonRpcUrl: string;
  }[];
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
