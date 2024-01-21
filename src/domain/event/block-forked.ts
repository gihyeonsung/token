import { Message } from '../message';

export class BlockForkedEvent implements Message {
  static TOPIC = BlockForkedEvent.name;

  readonly topic = BlockForkedEvent.TOPIC;

  constructor(readonly blockIdForked: string) {}
}
