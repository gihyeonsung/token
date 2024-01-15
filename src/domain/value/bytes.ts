import { isLowerHexString } from '../utils';

export class Bytes {
  private readonly value: string;

  constructor(value: string) {
    if (!isLowerHexString(value)) throw new Error('invalid value');

    this.value = value;
  }

  equals(other: Bytes): boolean {
    return this.value === other.value;
  }
}
