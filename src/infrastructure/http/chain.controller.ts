import { Express, Request, Response } from 'express';

import { ChainRepository } from '../../application';

export class ChainController {
  constructor(
    private readonly expressApp: Express,
    private readonly chainRepository: ChainRepository,
  ) {
    this.expressApp.get('/chains', (req, res) => {
      this.find(req, res).then(() => {
        res.end();
      });
    });

    this.expressApp.get('/chains/:id', (req, res) => {
      this.findOne(req, res).then(() => {
        res.end();
      });
    });
  }

  async find(req: Request, res: Response): Promise<void> {
    const { items, cursorNext } = await this.chainRepository.findOrderByStandardId(100);
    res.json({ status: 200, data: { items, cursorNext } });
  }

  async findOne(req: Request, res: Response): Promise<void> {
    const item = await this.chainRepository.findOneById(req.params.id);
    if (item === null) {
      res.json({ status: 404 }).status(404);
    }
    res.json({ status: 200, data: item });
  }
}
