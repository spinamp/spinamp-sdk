import {utils} from 'ethers';

export const formatAddressChecksum = (address: string) =>
  utils.getAddress(address);
