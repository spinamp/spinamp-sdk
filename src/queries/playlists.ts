import {Signer} from 'ethers';

import {parseApiPlaylist} from '@/modelParsers';
import {playlistApiClient} from '@/playlistApiClient';
import {fetchTracksByIds} from '@/queries/tracks';
import {IApiResponsePlaylist, IPlaylist, ITrack} from '@/types';
import {isValidId} from '@/utils/api';

export const fetchFeaturedPlaylists = async (): Promise<IPlaylist[]> => {
  const playlists = await playlistApiClient.get<IApiResponsePlaylist[]>(
    'playlist?verified=true',
  );
  return playlists.map(parseApiPlaylist);
};

export const fetchPlaylistById = async (
  playlistId: string,
): Promise<{playlist: IPlaylist; playlistTracks: ITrack[]}> => {
  const playlist = await playlistApiClient.get<IApiResponsePlaylist>(
    `playlist/${playlistId}`,
  );
  const playlistTracks = await fetchTracksByIds(playlist.trackIds);
  return {
    playlist: parseApiPlaylist(playlist),
    playlistTracks,
  };
};

export const fetchCollectorPlaylists = async (
  collectorAddress: string,
): Promise<IPlaylist[]> => {
  const playlists = await playlistApiClient.get<IApiResponsePlaylist[]>(
    `playlist?collector=${collectorAddress}`,
  );
  return playlists
    .filter(playlists => playlists.type === 'custom')
    .map(parseApiPlaylist);
};

export const createPlaylist = async (
  playlist: IPlaylist,
  signer: Signer,
): Promise<{id: string}> => {
  const msg = JSON.stringify({...playlist, type: 'custom'});

  const body = {
    msg,
    sig: await signer.signMessage(msg),
    address: await signer.getAddress(),
  };

  return playlistApiClient.post<IApiResponsePlaylist>('playlist', body);
};

export const updatePlaylist = async (
  id: string,
  data: Partial<IPlaylist>,
  signer: Signer,
): Promise<{id: string; trackIds: string[], title: string}> => {
  const msg = JSON.stringify({...data, type:'custom'});

  const body = {
    msg,
    sig: await signer.signMessage(msg),
    address: await signer.getAddress(),
  };

  if (!isValidId(id)) {
    throw 'Invalid playlist id';
  }

  return playlistApiClient.put<IApiResponsePlaylist>(`playlist/${id}`, body);
};
