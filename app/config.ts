export type Config = {
  chains: {
    standardId: number;
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
