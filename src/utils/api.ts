import {utils} from 'ethers';

export const isValidId = (id: string): boolean => {
  return !id.includes('/');
};

export const formatFirebaseId = (id: string) => {
  try {
    const idParts = id.split('/');
    const address = idParts[1];
    idParts[1] = utils.getAddress(address);
    return idParts.join('/');
  } catch (error) {
    return id;
  }
};
