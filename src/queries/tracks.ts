import {gql} from 'graphql-request';

import {pipelineClient} from '@/pipelineClient';
import {parseApiTrack, TRACK_FRAGMENT} from '@/pipelineModelParsers';
import {ITrack, IApiResponseTrack} from '@/types';

export const fetchTrackById = async (trackId: string): Promise<ITrack> => {
  const response = await pipelineClient.request(
    gql`
      query Track {
        processedTrackById(
          id: "${trackId}"
        ) {
          ...TrackDetails
          description
        }
      }
      ${TRACK_FRAGMENT}
    `,
  );

  return parseApiTrack(response.processedTrackById as IApiResponseTrack);
};

export const fetchTrackBySlug = async (
  slug: string,
): Promise<ITrack | null> => {
  const response = await pipelineClient.request(
    gql`
      query TrackBySlug {
        allProcessedTracks(
          first: 1
          orderBy: CREATED_AT_TIME_ASC
          filter: {slug: {startsWithInsensitive: "${slug}"}}
        ) {
          nodes {
            ...TrackDetails
            description
          }
        }
      }
      ${TRACK_FRAGMENT}
    `,
  );
  const {nodes} = response.allProcessedTracks;

  if (nodes.length === 0) {
    return null;
  }

  return parseApiTrack(nodes[0] as IApiResponseTrack);
};

export const fetchTrackByUrlParam = async (param: string): Promise<ITrack> =>
  (await fetchTrackBySlug(param)) || (await fetchTrackById(param));

export const fetchTrackByIdOrSlug = async (
  param: string,
): Promise<ITrack | null> => {
  try {
    return await fetchTrackById(param);
  } catch (error) {
    // ignore and try fetch by slug
  }

  return fetchTrackBySlug(param);
};

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
