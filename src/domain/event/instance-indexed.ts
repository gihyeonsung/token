import { Instance } from '../aggregate';

export class InstanceIndexedEvent {
  constructor(readonly instance: Instance) {}
}
