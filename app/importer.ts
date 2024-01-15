import { SNSClient } from '@aws-sdk/client-sns';
import { PrismaClient } from '@prisma/client';
import { WebSocketProvider } from 'ethers';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';

import { ChainService, NetworkImporter } from '../src/application';
import {
  EthersNetworkConnector,
  MessageSerializer,
  PrismaChainRepository,
  SnsMessagePublisher,
} from '../src/infrastructure';

import { Config } from './config';

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
  const snsClient = new SNSClient();
  const messageSerializer = new MessageSerializer();
  const snsMessagePublisher = new SnsMessagePublisher(snsClient, config.messaging.awsSnsTopicArn, messageSerializer);
  const networkImporter = new NetworkImporter(ethersNetworkConnector, snsMessagePublisher);
  await networkImporter.initialize();
};

main();
