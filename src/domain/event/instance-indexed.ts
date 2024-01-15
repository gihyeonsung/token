import { Instance } from '../aggregate';

export class InstanceIndexedEvent {
  static TOPIC = InstanceIndexedEvent.name;

  readonly topic = InstanceIndexedEvent.TOPIC;

  constructor(readonly instance: Instance) {}
}
