export interface IMusicPlatformData {
  id: string;
  name: string;
}

export interface IArtist {
  id: string;
  name: string;
  createdAtTime: string;
  slug: string;
  avatarIpfsHash: string;
  profiles: {
    [key: string]: IArtistProfile;
  };
}

export interface IArtistProfile {
  platformInternalId: string;
  platformId: string;
  name: string;
  createdAtTime: string;
  avatarUrl?: string;
  avatarIpfsHash?: string;
  websiteUrl?: string;
}

export interface ITrack {
  id: string;
  platformInternalId: string;
  title: string;
  slug: string;
  platformId: string;
  artistId: string;
  artist: IArtist;
  lossyAudioUrl: string;
  lossyArtworkIPFSHash?: string;
  lossyArtworkUrl?: string;
  description?: string;
  createdAtTime?: string;
  websiteUrl?: string;
}

export interface ICollectionTrack extends ITrack {
  quantity: number;
}

export interface INft {
  id: string;
  createdAtTime: string;
  createdAtBlockNumber: string;
  chainId: string;
  tokenId: string;
  contractAddress: string;
  platformId: string;
  owner: string;
  owners: string[];
  metadata: unknown;
}

export interface ITrackNft extends INft {
  trackId: string;
}

export interface IPlaylist {
  id: string;
  title: string;
  trackIds: string[];
  collector?: string;
}

export interface ISyncedRecord {
  updateAtTime: string; //timestamp
}

export interface IApiResponseArtist extends Omit<IArtist, 'profiles'> {
  artistProfilesByArtistId: {
    nodes: IArtistProfile[];
  };
}

export interface IApiResponseTrack extends Omit<ITrack, 'artist'> {
  artistByArtistId: IApiResponseArtist;
  lossyAudioIpfsHash?: string;
  lossyArtworkIpfsHash?: string;
}

export interface IApiResponsePlaylist extends IPlaylist {
  type: string;
}

export interface IApiResponseCollection {
  id: string;
  nftsProcessedTracksByNftId: {
    nodes: {
      processedTrackByProcessedTrackId: IApiResponseTrack;
    }[];
  };
}

export interface IApiResponseNft extends Omit<INft, 'owner' | 'owners'> {
  nftsCollectorsByNftId: {
    nodes: {
      addressId: string;
    }[];
  };
}

export interface IApiListQueryResponse<ListItem> {
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
  items: ListItem[];
}

export interface IApiListQueryParams {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  offset?: number;
  filter?: unknown;
  orderBy?: string[];
}
