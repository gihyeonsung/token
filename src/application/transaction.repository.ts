import { Transaction } from '../domain';

import { GenericRepository } from './generic.repository';

export type TransactionRepository = GenericRepository<Transaction>;
