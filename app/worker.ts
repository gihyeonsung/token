import 'dotenv/config';

import { NetworkImporter } from '../src/application';
import { EthersNetworkConnector, SqsMessageSubscriber } from '../src/infrastructure';

const main = async () => {
  const connector = new EthersNetworkConnector(process.env.RPC_URL!!);
  const subscriber = new SqsMessageSubscriber(process.env.AWS_SQS_QUEUE_URL!!);
};

main();
