import {
  IArtist,
  ITrack,
  IApiResponseArtist,
  IApiResponseTrack,
  IApiResponsePlaylist,
  IPlaylist,
  IApiResponseNft,
  INft,
} from '@/types';
import { formatFirebaseId } from '@/utils/api';
import { getAudioUrl, getImageUrl } from "@/utils/media";

export const parseApiArtist = (artist: IApiResponseArtist): IArtist => ({
  id: artist.id,
  slug: artist.slug,
  createdAtTime: artist.createdAtTime,
  name: artist.name,
  avatarIpfsHash: artist.avatarIpfsHash,
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
          avatarIpfsHash: currentProfile.avatarIpfsHash,
          avatarUrl: getImageUrl(currentProfile.avatarIpfsHash, currentProfile.avatarUrl),
          websiteUrl: currentProfile.websiteUrl,
        },
      };
    },
    {},
  ),
});

export const parseApiTrack = (track: IApiResponseTrack): ITrack => {
  return {
    id: track.id,
    platformInternalId: track.platformInternalId,
    title: track.title,
    slug: track.slug,
    createdAtTime: track.createdAtTime,
    platformId: track.platformId,
    description: track.description,
    websiteUrl: track.websiteUrl,
    lossyArtworkIPFSHash: track.lossyArtworkIpfsHash,
    lossyAudioUrl: getAudioUrl(track.lossyAudioIpfsHash, track.lossyAudioUrl),
    lossyArtworkUrl: getImageUrl(track.lossyArtworkIpfsHash, track.lossyArtworkUrl),
    artistId: track.artistId,
    artist: parseApiArtist(track.artistByArtistId),
  };
};

export const parseApiPlaylist = (
  playlist: IApiResponsePlaylist,
): IPlaylist => ({
  id: playlist.id,
  title: playlist.title,
  trackIds: playlist.trackIds?.map(formatFirebaseId),
  collector: playlist.collector,
});

export const parseApiNft = (nft: IApiResponseNft): INft => {
  const { nftsCollectorsByNftId, ...parsedNft } = nft;
  const owners = nftsCollectorsByNftId.nodes.map(node => node.addressId);

  return {
    ...parsedNft,
    owners,
    owner: owners[0],
  };
};
