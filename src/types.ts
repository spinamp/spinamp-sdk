export type MusicPlatform = string;

export interface IArtist {
  id: string;
  name: string;
  createdAtTime: string;
  slug: string;
  profiles: {
    [key: MusicPlatform]: IArtistProfile;
  };
}

export interface IArtistProfile {
  platformInternalId: string;
  platformId: MusicPlatform;
  name: string;
  createdAtTime: string;
  avatarUrl?: string;
  websiteUrl?: string;
}

export interface ITrack {
  id: string;
  platformInternalId: string;
  title: string;
  slug: string;
  platformId: MusicPlatform;
  artistId: string;
  artist: IArtist;
  lossyAudioUrl: string;
  lossyArtworkUrl?: string;
  description?: string;
  createdAtTime?: string;
  websiteUrl?: string;
}

export interface IMusicPlatformData {
  id: string;
  name: string;
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
