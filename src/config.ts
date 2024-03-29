export interface IConfig {
  SPINDEX_NODE_URL: string;
  PLAYLIST_NODE_URL: string;
  IPFS_GATEWAY_URL_IMAGE: string;
  IPFS_GATEWAY_URL_AUDIO: string;
}

const defaultConfig: IConfig = {
  SPINDEX_NODE_URL: 'https://api.spinamp.xyz/v3/graphql',
  PLAYLIST_NODE_URL: 'https://us-central1-spinamp-prod.cloudfunctions.net',
  IPFS_GATEWAY_URL_IMAGE: 'https://content.spinamp.xyz/image/upload/ipfs_image',
  IPFS_GATEWAY_URL_AUDIO: 'https://content.spinamp.xyz/video/upload/ipfs_audio',
};

const _config: IConfig = {...defaultConfig};

export const config: IConfig = {
  get SPINDEX_NODE_URL() {
    return _config.SPINDEX_NODE_URL || defaultConfig.SPINDEX_NODE_URL;
  },
  get PLAYLIST_NODE_URL() {
    return _config.PLAYLIST_NODE_URL || defaultConfig.PLAYLIST_NODE_URL;
  },
  get IPFS_GATEWAY_URL_IMAGE() {
    return (
      _config.IPFS_GATEWAY_URL_IMAGE || defaultConfig.IPFS_GATEWAY_URL_IMAGE
    );
  },
  get IPFS_GATEWAY_URL_AUDIO() {
    return (
      _config.IPFS_GATEWAY_URL_AUDIO || defaultConfig.IPFS_GATEWAY_URL_AUDIO
    );
  },
};

export const updateConfig = (updatedConfig: Partial<IConfig> = {}) => {
  Object.assign(_config, updatedConfig);
};
