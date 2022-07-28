import {gql} from 'graphql-request';

import {pipelineClient} from '@/pipelineClient';
import {
  ARTIST_FRAGMENT,
  parseApiArtist,
  parseApiTrack,
  TRACK_FRAGMENT,
} from '@/pipelineModelParsers';
import {IArtist, ITrack, IApiResponseArtist} from '@/types';

export const fetchArtistById = async (artistId: string): Promise<IArtist> => {
  const artist = await pipelineClient.request(
    gql`
      query Artist {
        artistById(id: "${artistId}") {
          ...ArtistDetails
        }
      }
      ${ARTIST_FRAGMENT}
    `,
  );

  return parseApiArtist(artist.artistById as IApiResponseArtist);
};

export const fetchArtistBySlug = async (
  slug: string,
): Promise<IArtist | null> => {
  const response = await pipelineClient.request(
    gql`
      query ArtistBySlug {
        allArtists(
          first: 1
          orderBy: CREATED_AT_TIME_ASC
          filter: {slug: {startsWithInsensitive: "${slug}"}}
        ) {
          nodes {
            ...ArtistDetails
          }
        }
      }
      ${ARTIST_FRAGMENT}
    `,
  );
  const { nodes  } = response.allArtists;

  if (nodes.length === 0) {
    return null;
  }

  return parseApiArtist(nodes[0] as IApiResponseArtist);
};

export const fetchArtistByUrlParam = async (param: string): Promise<IArtist> =>
  (await fetchArtistBySlug(param)) || (await fetchArtistById(param));

export const fetchArtistByIdOrSlug = async (
  param: string,
): Promise<IArtist | null> => {
  try {
    return await fetchArtistById(param);
  } catch (error) {
    // ignore and try fetch by slug
  }

  return fetchArtistBySlug(param);
};

export const fetchArtistTracks = async (
  artistId: string,
): Promise<ITrack[]> => {
  const response = await pipelineClient.request(gql`
    query ArtistTracks {
      allProcessedTracks(
        orderBy: CREATED_AT_TIME_DESC
        filter: {
          artistId: {
            equalTo: "${artistId}"
          }
        }
      ) {
        nodes {
          ...TrackDetails
        }
      }
    }
    ${TRACK_FRAGMENT}
  `);

  return response.allProcessedTracks.nodes.map(parseApiTrack);
};

export const fetchArtistDetails = async (id: string) => {
  const artist = await fetchArtistByIdOrSlug(id);
  const tracks = await fetchArtistTracks(artist!.id);

  return {
    artist,
    tracks,
  };
};
