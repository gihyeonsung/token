export type Config = {
  rpcProviders: { chainStandardId: number; websocketUrl: string }[];
  awsSqsQueueUrl: string;
};
