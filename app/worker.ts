import { readFile } from 'fs/promises';
import { parse } from 'yaml';

import {
  EthersNetworkConnector,
  PrismaChainRepository,
  SqsMessagePublisher,
  SqsMessageSubscriber,
} from '../src/infrastructure';

import { Config } from './config';
import { PrismaClient } from '@prisma/client';
import { WebSocketProvider } from 'ethers';
import { ChainService } from '../src/application';

const main = async () => {
  const configString = await readFile('config.yaml', 'utf8');
  const config: Config = parse(configString);
  const prismaClient = new PrismaClient();
  const prismaChainRepository = new PrismaChainRepository(prismaClient);
  const chainService = new ChainService(prismaChainRepository);
  const chains = await chainService.findByStandardIdOrCreate(config.chains.map((p) => p.standardId));
  const ethersProviders = new Map(
    chains.map((c, i) => [c.id, new WebSocketProvider(config.chains[i].websocketJsonRpcUrl)]),
  );
  const ethersNetworkConnector = new EthersNetworkConnector(ethersProviders);
  const sqsMessagePublisher = new SqsMessagePublisher(config.awsSqsQueueUrl);
  const sqsMessageSubscriber = new SqsMessageSubscriber(config.awsSqsQueueUrl);
  sqsMessageSubscriber.subscribe(async (message) => {
    console.log('received', message);
  });
  await sqsMessageSubscriber.listen();
};

main();
