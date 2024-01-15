export class MessageSerializer {
  toString(message: object): string {
    const replacer = (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return { _isBigInt: true, value: value.toString() };
      }
      return value;
    };
    return JSON.stringify(message, replacer);
  }

  toMessage(string: string): object {
    const reviver = (_key: string, value: any) => {
      if (typeof value === 'object' && value !== null && value._isBigInt) {
        return BigInt(value.value);
      }
      return value;
    };
    return JSON.parse(string, reviver);
  }
}
