import { Interface, isAddress, isHexString } from 'ethers';

export const isLower = (s: string): boolean => s === s.toLowerCase();

export const isLowerAddress = (s: string): boolean => isLower(s) && isAddress(s);

export const isLowerHexString = (s: string, length?: number): boolean =>
  isLower(s) && isHexString(s) && (length ? s.length === length : true);

export const decodeEvent = <Result>(signature: string, topics: string[], data: string): Result | null => {
  const iface = new Interface([signature]);
  const log = iface.parseLog({ topics, data });
  if (log === null) {
    return null;
  }

  // TODO: address 타입이 아니라 string에 대해서는 제외 필요
  return log.args.map((arg) => (typeof arg === 'string' ? arg.toLowerCase() : arg)) as Result;
};
