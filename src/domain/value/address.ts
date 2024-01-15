import { isLowerAddress } from '../utils';

export class Address {
  private readonly value: string;

  constructor(value: string) {
    if (!isLowerAddress(value)) throw new Error('invalid value');

    this.value = value;
  }

  equals(other: Address): boolean {
    return this.value === other.value;
  }
}
