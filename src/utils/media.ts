import {config} from "@/config";

export const getAudioUrl = (
  audioIpfsHash: string | undefined,
  fallbackUrl: string
) =>
  audioIpfsHash
    ? `${config.IPFS_GATEWAY_URL_AUDIO}/${audioIpfsHash}`
    : fallbackUrl;

export const getImageUrl = (
  imageIpfsHash?: string | null,
  fallbackUrl?: string,
) =>
  imageIpfsHash
    ? `${config.IPFS_GATEWAY_URL_IMAGE}/${imageIpfsHash}`
    : fallbackUrl;
