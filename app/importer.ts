import { parse } from 'yaml';
import { readFile } from 'fs/promises';

import { NetworkImporter } from '../src/application';
import { EthersNetworkConnector, SqsMessagePublisher } from '../src/infrastructure';
import { Config } from './config';
import { PrismaChainRepository } from '../src/infrastructure/prisma-chains.repository';

const main = async () => {
  const configString = await readFile('config.yaml', 'utf8');
  const config: Config = parse(configString);
  const ethersProviders = new Map();
  const networkConnector = new EthersNetworkConnector(ethersProviders);
  const messagePublisher = new SqsMessagePublisher(process.env.AWS_SQS_QUEUE_URL!!);
  const networkImporter = new NetworkImporter(networkConnector, messagePublisher);
  await networkImporter.initialize();
};

main();
