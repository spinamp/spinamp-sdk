import {gql} from 'graphql-request';

import {parseApiTrack} from '@/modelParsers';
import {TRACK_FRAGMENT} from '@/queries/fragments';
import {spindexClient} from '@/spindexClient';
import {IApiResponseCollection, ICollectionTrack, ITrack} from '@/types';

const countTracksQuantity = (tracks: ITrack[]): ICollectionTrack[] => {
  const countedTrackIds = tracks.reduce<{[id: string]: ICollectionTrack}>(
    (result, track) => ({
      ...result,
      [track.id]: {
        ...track,
        quantity: (result[track.id]?.quantity || 0) + 1,
      },
    }),
    {},
  );

  return Object.values(countedTrackIds);
};

export const fetchCollectionForAddress = async (
  address: string,
): Promise<ICollectionTrack[]> => {
  const {allNfts} = await spindexClient.request(
    gql`
      query Collection($address: String) {
        allNfts(
          orderBy: CREATED_AT_TIME_DESC
          filter: {owner: {equalToInsensitive: $address}}
        ) {
          nodes {
            id
            nftsProcessedTracksByNftId {
              nodes {
                processedTrackByProcessedTrackId {
                  ...TrackDetails
                }
              }
            }
          }
        }
      }
      ${TRACK_FRAGMENT}
    `,
    {
      address: address.toLowerCase(),
    },
  );
  const nfts: IApiResponseCollection[] = allNfts.nodes;
  const tracks = nfts
    .map(node => node.nftsProcessedTracksByNftId.nodes[0])
    .filter(node => !!node)
    .map(node => parseApiTrack(node.processedTrackByProcessedTrackId));

  return countTracksQuantity(tracks);
};
