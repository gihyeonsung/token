import { isAddress, isHexString } from 'ethers';

export const isLower = (s: string): boolean => s === s.toLowerCase();

export const isLowerAddress = (s: string): boolean => isLower(s) && isAddress(s);

export const isLowerHexString = (s: string, length = 66): boolean =>
  isLower(s) && isHexString(s) && s.length === length;
