import { isAddress, isHexString } from 'ethers';

export const isLower = (s: string): boolean => s === s.toLowerCase();

export const isLowerAddress = (s: string): boolean => isLower(s) && isAddress(s);

export const isLowerHexString = (s: string, length?: number): boolean =>
  isLower(s) && isHexString(s) && (length ? s.length === length : true);
