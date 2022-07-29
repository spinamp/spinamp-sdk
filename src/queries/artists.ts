import {gql} from 'graphql-request';

import {pipelineClient} from '@/pipelineClient';
import {
  ARTIST_FRAGMENT,
  parseApiArtist,
  parseApiTrack,
  TRACK_FRAGMENT,
} from '@/pipelineModelParsers';
import {
  IArtist,
  ITrack,
  IApiResponseArtist,
  IApiListQueryResponse,
  IApiListQueryParams,
} from '@/types';

export const fetchAllArtists = async ({
  after,
  before,
  first,
  last,
  offset,
  filter,
  orderBy = ['NAME_ASC'],
}: IApiListQueryParams = {}): Promise<IApiListQueryResponse<IArtist>> => {
  const {allArtists} = await pipelineClient.request(
    gql`
      query AllArtists(
        $after: Cursor
        $before: Cursor
        $first: Int
        $last: Int
        $offset: Int
        $filter: ArtistFilter
        $orderBy: [ArtistsOrderBy!]
      ) {
        allArtists(
          after: $after
          before: $before
          first: $first
          last: $last
          offset: $offset
          filter: $filter
          orderBy: $orderBy
        ) {
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          nodes {
            ...ArtistDetails
          }
        }
      }
      ${ARTIST_FRAGMENT}
    `,
    {
      after,
      before,
      first,
      last,
      offset,
      filter,
      orderBy,
    },
  );

  const {totalCount, pageInfo, nodes} = allArtists;
  const items = (nodes as IApiResponseArtist[]).map(parseApiArtist);

  return {
    totalCount,
    pageInfo,
    items,
  };
};

export const fetchArtistById = async (
  artistId: string,
): Promise<IArtist | null> => {
  const artist = await pipelineClient.request(
    gql`
      query Artist($artistId: String!) {
        artistById(id: $artistId) {
          ...ArtistDetails
        }
      }
      ${ARTIST_FRAGMENT}
    `,
    {artistId},
  );

  if (!artist) {
    return null;
  }

  return parseApiArtist(artist.artistById as IApiResponseArtist);
};

export const fetchArtistBySlug = async (
  slug: string,
): Promise<IArtist | null> => {
  const response = await pipelineClient.request(
    gql`
      query ArtistBySlug($slug: String) {
        allArtists(
          first: 1
          orderBy: CREATED_AT_TIME_ASC
          filter: {slug: {startsWithInsensitive: $slug}}
        ) {
          nodes {
            ...ArtistDetails
          }
        }
      }
      ${ARTIST_FRAGMENT}
    `,
    {slug},
  );
  const {nodes} = response.allArtists;

  if (nodes.length === 0) {
    return null;
  }

  return parseApiArtist(nodes[0] as IApiResponseArtist);
};

export const fetchArtistBySlugOrId = async (
  slugOrId: string,
): Promise<IArtist | null> =>
  (await fetchArtistBySlug(slugOrId)) || (await fetchArtistById(slugOrId));

export const fetchArtistByIdOrSlug = async (
  idOrSlug: string,
): Promise<IArtist | null> =>
  (await fetchArtistById(idOrSlug)) || (await fetchArtistBySlug(idOrSlug));

export const fetchArtistTracks = async (
  artistId: string,
): Promise<ITrack[]> => {
  const response = await pipelineClient.request(
    gql`
      query ArtistTracks($artistId: String) {
        allProcessedTracks(
          orderBy: CREATED_AT_TIME_DESC
          filter: {artistId: {equalTo: $artistId}}
        ) {
          nodes {
            ...TrackDetails
          }
        }
      }
      ${TRACK_FRAGMENT}
    `,
    {artistId},
  );

  return response.allProcessedTracks.nodes.map(parseApiTrack);
};

export const fetchArtistWithTracks = async (
  idOrSlug: string,
): Promise<{artist: IArtist | null; tracks: ITrack[]}> => {
  const artist = await fetchArtistByIdOrSlug(idOrSlug);

  if (!artist) {
    return {
      artist,
      tracks: [],
    };
  }

  const tracks = await fetchArtistTracks(artist.id);

  return {
    artist,
    tracks,
  };
};
