import { Base } from './base';

export class Instance extends Base {
  instanceId: bigint;
  ownerAddress: string;
  uri?: unknown;
  metadata?: unknown;
}
