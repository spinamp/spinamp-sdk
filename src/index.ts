import {updateConfig, IConfig} from '@/config';
import {spindexClient} from '@/spindexClient';

export * from '@/queries/artists';
export * from '@/queries/collection';
export * from '@/queries/platforms';
export * from '@/queries/playlists';
export * from '@/queries/tracks';

export * from '@/utils/images';

export {
  ITrack,
  ICollectionTrack,
  IArtist,
  IArtistProfile,
  IMusicPlatformData,
  IPlaylist,
  IApiListQueryParams,
  IApiListQueryResponse,
} from '@/types';

export const initialize = (config?: Partial<IConfig>) => {
  updateConfig(config);

  if (config?.SPINDEX_NODE_URL) {
    spindexClient.setEndpoint(config.SPINDEX_NODE_URL);
  }
};
