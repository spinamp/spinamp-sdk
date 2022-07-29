import {gql} from 'graphql-request';

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
