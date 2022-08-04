import {gql} from 'graphql-request';

import {spindexClient} from '@/spindexClient';
import {INft} from '@/types';

export const fetchTrackNfts = async (trackId: string): Promise<INft[]> => {
  const {allNftsProcessedTracks} = await spindexClient.request(
    gql`
      query NftsForTrack($trackId: String) {
        allNftsProcessedTracks(
          filter: {processedTrackId: {equalTo: $trackId}}
        ) {
          nodes {
            nftByNftId {
              id
              createdAtTime
              createdAtEthereumBlockNumber
              tokenId
              contractAddress
              platformId
              owner
              metadata
            }
          }
        }
      }
    `,
    {trackId},
  );

  const nodes: {nftByNftId: INft}[] = allNftsProcessedTracks.nodes;
  return nodes.map(({nftByNftId}) => nftByNftId);
};

export const fetchTrackNftsOwners = async (
  trackId: string,
): Promise<string[]> => {
  const nfts = await fetchTrackNfts(trackId);
  const owners = nfts.map(({owner}) => owner);
  return [...new Set(owners)];
};
