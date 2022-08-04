import {gql} from 'graphql-request';

import {NFT_FRAGMENT} from '@/queries/fragments';
import {spindexClient} from '@/spindexClient';
import {INft, ITrackNft} from '@/types';

export const fetchTrackNfts = async (trackId: string): Promise<INft[]> => {
  const {allNftsProcessedTracks} = await spindexClient.request(
    gql`
      query NftsForTrack($trackId: String) {
        allNftsProcessedTracks(
          filter: {processedTrackId: {equalTo: $trackId}}
        ) {
          nodes {
            nftByNftId {
              ...NftDetails
            }
          }
        }
      }
      ${NFT_FRAGMENT}
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

export const fetchArtistNfts = async (
  artistId: string,
): Promise<ITrackNft[]> => {
  const {artistById} = await spindexClient.request(
    gql`
      query NftsForArtist($artistId: String!) {
        artistById(id: $artistId) {
          tracks: processedTracksByArtistId {
            nodes {
              trackNfts: nftsProcessedTracksByProcessedTrackId {
                nodes {
                  processedTrackId
                  nftByNftId {
                    ...NftDetails
                  }
                }
              }
            }
          }
        }
      }
      ${NFT_FRAGMENT}
    `,
    {artistId},
  );

  const trackNodes: {
    trackNfts: {
      nodes: {processedTrackId: string; nftByNftId: INft}[];
    };
  }[] = artistById.tracks.nodes;

  return trackNodes.reduce<ITrackNft[]>((result, track) => {
    const trackNfts = track.trackNfts.nodes.map(node => ({
      ...node.nftByNftId,
      trackId: node.processedTrackId,
    }));
    return [...result, ...trackNfts];
  }, []);
};

export const fetchArtistNftsOwners = async (
  artistId: string,
): Promise<string[]> => {
  const nfts = await fetchArtistNfts(artistId);
  const owners = nfts.map(({owner}) => owner);
  return [...new Set(owners)];
};
