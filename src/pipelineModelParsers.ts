import {gql} from 'graphql-request';

import {config} from '@/config';
import {IArtist, ITrack, IApiResponseArtist, IApiResponseTrack} from '@/types';

export const ARTIST_FRAGMENT = gql`
  fragment ArtistDetails on Artist {
    id
    createdAtTime
    name
    slug
    artistProfilesByArtistId {
      nodes {
        avatarUrl
        createdAtTime
        name
        platformId
        platformInternalId
        websiteUrl
      }
    }
  }
`;

export const parseApiArtist = (artist: IApiResponseArtist): IArtist => ({
    id: artist.id,
  slug: artist.slug,
  createdAtTime: artist.createdAtTime,
  name: artist.name,
  profiles: artist.artistProfilesByArtistId.nodes.reduce(
    (profiles, currentProfile) => {
      if (!currentProfile) {
        return profiles;
      }

      return {
        ...profiles,
        [currentProfile.platformId]: {
          platformInternalId: currentProfile.platformInternalId,
          platformId: currentProfile.platformId,
          name: currentProfile.name,
          createdAtTime: currentProfile.createdAtTime,
          avatarUrl: currentProfile.avatarUrl,
          websiteUrl: currentProfile.websiteUrl,
        },
      };
    },
    {},
  ),
});

export const TRACK_FRAGMENT = gql`
  fragment TrackDetails on ProcessedTrack {
    id
    platformInternalId
    title
    slug
    description
    createdAtTime
    platformId
    websiteUrl
    lossyAudioUrl
    lossyArtworkUrl
    lossyAudioIpfsHash
    lossyArtworkIpfsHash
    artistId
    artistByArtistId {
      ...ArtistDetails
    }
  }
  ${ARTIST_FRAGMENT}
`;

export const parseApiTrack = (track: IApiResponseTrack): ITrack => {
  const lossyAudioUrl =
    track.lossyAudioIpfsHash && track.lossyAudioIpfsHash !== ''
      ? `${config.IPFS_GATEWAY_URL_AUDIO}${track.lossyAudioIpfsHash}?resource_type=video`
      : track.lossyAudioUrl;
  const lossyArtworkUrl =
    track.lossyArtworkIpfsHash && track.lossyArtworkIpfsHash !== ''
      ? `${config.IPFS_GATEWAY_URL_IMAGE}${track.lossyArtworkIpfsHash}`
      : track.lossyArtworkUrl;
  return {
    id: track.id,
    platformInternalId: track.platformInternalId,
    title: track.title,
    slug: track.slug,
    createdAtTime: track.createdAtTime,
    platformId: track.platformId,
    description: track.description,
    websiteUrl: track.websiteUrl,
    lossyAudioUrl,
    lossyArtworkUrl,
    artistId: track.artistId,
    artist: parseApiArtist(track.artistByArtistId),
  };
};
