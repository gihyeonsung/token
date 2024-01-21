import { Express, Request, Response } from 'express';

import { ChainRepository } from '../../application';
import { Chain } from '../../domain';

import { GenericResponseBody, GenericResponsePaginatedBody } from './generic-response.dto';

export class ChainController {
  constructor(
    private readonly expressApp: Express,
    private readonly chainRepository: ChainRepository,
  ) {
    this.expressApp.get('/chains', (req, res) => {
      this.find(req, res).then((data) => {
        res.status(data.status).json(data);
      });
    });
    this.expressApp.get('/chains/:id', (req, res) => {
      this.findOne(req, res).then((data) => {
        res.status(data.status).json(data);
      });
    });
  }

  async find(req: Request, res: Response): Promise<GenericResponsePaginatedBody<Chain>> {
    const { items, cursorNext } = await this.chainRepository.findOrderByStandardId(100);
    return { status: 200, data: { items, cursorNext } };
  }

  async findOne(req: Request, res: Response): Promise<GenericResponseBody<Chain>> {
    const item = await this.chainRepository.findOneById(req.params.id);
    if (item === null) {
      return { status: 404 };
    }
    return { status: 200, data: item };
  }
}
