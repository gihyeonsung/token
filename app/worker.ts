import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { PrismaClient } from '@prisma/client';
import { WebSocketProvider } from 'ethers';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';

import { BlockService, ChainService, TransactionService } from '../src/application';
import {
  EthersNetworkConnector,
  PrismaBlockRepository,
  PrismaChainRepository,
  PrismaTransactionRepository,
  SnsMessagePublisher,
  SqsMessageSubscriber,
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
  const snsClient = new SNSClient({});
  const snsMessagePublisher = new SnsMessagePublisher(snsClient, config.messaging.awsSnsTopicArn);
  const sqsClient = new SQSClient();
  const sqsMessageSubscriber = new SqsMessageSubscriber(sqsClient, config.messaging.queues);

  const prismaBlockRepository = new PrismaBlockRepository(prismaClient);
  const blockService = new BlockService(
    ethersNetworkConnector,
    prismaBlockRepository,
    sqsMessageSubscriber,
    snsMessagePublisher,
  );

  const prismaTransactionRepository = new PrismaTransactionRepository(prismaClient);
  const transactionService = new TransactionService(
    prismaTransactionRepository,
    ethersNetworkConnector,
    sqsMessageSubscriber,
    snsMessagePublisher,
  );

  await sqsMessageSubscriber.listen();
};

main();
