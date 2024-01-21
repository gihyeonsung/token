import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { PrismaClient } from '@prisma/client';
import { WebSocketProvider } from 'ethers';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import express from 'express';

import { BlockService, ChainService, TokenService, TransactionService, TransferService } from '../src/application';
import {
  ChainController,
  ConsoleLogger,
  EthersNetworkConnector,
  MessageSerializer,
  PrismaBlockRepository,
  PrismaChainRepository,
  PrismaInstanceRepository,
  PrismaTokenRepository,
  PrismaTransactionRepository,
  PrismaTransferRepository,
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
  const websocketProviders = new Map(
    chains.map((c, i) => [c.id, new WebSocketProvider(config.chains[i].websocketJsonRpcUrl)]),
  );
  const ethersNetworkConnector = new EthersNetworkConnector(websocketProviders);

  const messageSerializer = new MessageSerializer();
  const snsClient = new SNSClient({});
  const snsMessagePublisher = new SnsMessagePublisher(snsClient, config.messaging.awsSnsTopicArn, messageSerializer);
  const sqsClient = new SQSClient();
  const sqsMessageSubscriber = new SqsMessageSubscriber(sqsClient, config.messaging.queues, messageSerializer);

  const prismaBlockRepository = new PrismaBlockRepository(prismaClient);
  const consoleLogger = new ConsoleLogger();
  const blockService = new BlockService(
    ethersNetworkConnector,
    prismaBlockRepository,
    sqsMessageSubscriber,
    snsMessagePublisher,
    consoleLogger,
  );

  const prismaTransactionRepository = new PrismaTransactionRepository(prismaClient);
  const transactionService = new TransactionService(
    prismaTransactionRepository,
    ethersNetworkConnector,
    sqsMessageSubscriber,
    snsMessagePublisher,
    consoleLogger,
  );

  const prismaTransferRepository = new PrismaTransferRepository(prismaClient);
  const prismaTokenRepository = new PrismaTokenRepository(prismaClient);
  const prismaInstanceRepository = new PrismaInstanceRepository(prismaClient);

  const transfersService = new TransferService(
    prismaTransferRepository,
    prismaTransactionRepository,
    prismaTokenRepository,
    prismaInstanceRepository,
    sqsMessageSubscriber,
    snsMessagePublisher,
    consoleLogger,
  );

  const tokenService = new TokenService(
    prismaTokenRepository,
    prismaTransferRepository,
    ethersNetworkConnector,
    sqsMessageSubscriber,
    snsMessagePublisher,
    consoleLogger,
  );

  const expressApp = express();

  expressApp.use((req, res, next) => {
    next();
    consoleLogger.info('handled', req.method, req.originalUrl);
  });

  const chainController = new ChainController(expressApp, prismaChainRepository);

  expressApp.listen(config.api.port, config.api.host, 511, () => {
    consoleLogger.info(`application ready`, config.api.host, config.api.port);
  });
};

main();
