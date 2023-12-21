import 'dotenv/config';

import { NetworkImporter } from '../src/application';
import { EthersNetworkConnector, SqsMessagePublisher } from '../src/infrastructure';

const main = async () => {
  const ethConn = new EthersNetworkConnector(process.env.RPC_URL!!);
  const snsMsgPub = new SqsMessagePublisher(process.env.AWS_SQS_QUEUE_URL!!);
  new NetworkImporter([ethConn], snsMsgPub);
};

main();
