import { Base } from './base';

export class Chain extends Base {
  readonly standardId: number;

  constructor(id: string, createdAt: Date, updatedAt: Date, standardId: number) {
    super(id, createdAt, updatedAt);

    this.standardId = standardId;
  }
}
