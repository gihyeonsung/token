import { EthersNetworkConnector, SqsMessagePublisher, SqsMessageSubscriber } from '../src/infrastructure';

const main = async () => {
  const networkConnector = new EthersNetworkConnector(process.env.RPC_URL!!);
  const messagePublisher = new SqsMessagePublisher(process.env.AWS_SQS_QUEUE_URL!!);
  const messageSubscriber = new SqsMessageSubscriber(process.env.AWS_SQS_QUEUE_URL!!);
};

main();
