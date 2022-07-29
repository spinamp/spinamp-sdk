import {gql} from 'graphql-request';

import {pipelineClient} from '@/pipelineClient';
import {parseApiTrack, TRACK_FRAGMENT} from '@/pipelineModelParsers';
import {
  ITrack,
  IApiResponseTrack,
  IApiListQueryResponse,
  IApiListQueryParams,
} from '@/types';

export const fetchAllTracks = async ({
  after,
  before,
  first,
  last,
  offset,
  filter,
  orderBy = ['CREATED_AT_TIME_DESC'],
}: IApiListQueryParams = {}): Promise<IApiListQueryResponse<ITrack>> => {
  const {allProcessedTracks} = await pipelineClient.request(
    gql`
      query AllTracks(
        $after: Cursor
        $before: Cursor
        $first: Int
        $last: Int
        $offset: Int
        $filter: ProcessedTrackFilter
        $orderBy: [ProcessedTracksOrderBy!]
      ) {
        allProcessedTracks(
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
            ...TrackDetails
          }
        }
      }
      ${TRACK_FRAGMENT}
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

  const {totalCount, pageInfo, nodes} = allProcessedTracks;
  const items = (nodes as IApiResponseTrack[]).map(parseApiTrack);

  return {
    totalCount,
    pageInfo,
    items,
  };
};

export const fetchTrackById = async (
  trackId: string,
): Promise<ITrack | null> => {
  const track = await pipelineClient.request(
    gql`
      query Track($trackId: String!) {
        processedTrackById(id: $trackId) {
          ...TrackDetails
          description
        }
      }
      ${TRACK_FRAGMENT}
    `,
    {trackId},
  );

  if (!track.processedTrackById) {
    return null;
  }

  return parseApiTrack(track.processedTrackById as IApiResponseTrack);
};

export const fetchTrackBySlug = async (
  slug: string,
): Promise<ITrack | null> => {
  const response = await pipelineClient.request(
    gql`
      query TrackBySlug($slug: String) {
        allProcessedTracks(
          first: 1
          orderBy: CREATED_AT_TIME_ASC
          filter: {slug: {startsWithInsensitive: $slug}}
        ) {
          nodes {
            ...TrackDetails
            description
          }
        }
      }
      ${TRACK_FRAGMENT}
    `,
    {slug},
  );
  const {nodes} = response.allProcessedTracks;

  if (nodes.length === 0) {
    return null;
  }

  return parseApiTrack(nodes[0] as IApiResponseTrack);
};

export const fetchTrackBySlugOrId = async (
  slugOrId: string,
): Promise<ITrack | null> =>
  (await fetchTrackBySlug(slugOrId)) || (await fetchTrackById(slugOrId));

export const fetchTrackByIdOrSlug = async (
  idOrSlug: string,
): Promise<ITrack | null> =>
  (await fetchTrackById(idOrSlug)) || (await fetchTrackBySlug(idOrSlug));

export const fetchTracksByIds = async (
  trackIds: string[],
): Promise<ITrack[]> => {
  const response = await pipelineClient.request(
    gql`
      query TracksById($trackIds: [String!]) {
        allProcessedTracks(
          orderBy: CREATED_AT_TIME_DESC
          filter: {id: {in: $trackIds}}
        ) {
          nodes {
            ...TrackDetails
          }
        }
      }
      ${TRACK_FRAGMENT}
    `,
    {trackIds},
  );

  const tracks: ITrack[] = response.allProcessedTracks.nodes.map(parseApiTrack);
  return trackIds
    .map(trackId => tracks.find(track => track.id === trackId))
    .filter(track => !!track) as ITrack[];
};
