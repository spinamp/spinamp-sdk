import {firebaseClient} from '@/firebaseClient';
import {parseApiPlaylist} from '@/modelParsers';
import {IApiResponsePlaylist, IPlaylist} from '@/types';

export const fetchFeaturedPlaylists = async (): Promise<IPlaylist[]> => {
  const playlists = await firebaseClient.get<IApiResponsePlaylist[]>(
    'playlist?verified=true',
  );
  return playlists.map(parseApiPlaylist);
};

export const fetchPlaylistById = async (
  playlistId: string,
): Promise<IPlaylist> => {
  const playlist = await firebaseClient.get<IApiResponsePlaylist>(
    `playlist/${playlistId}`,
  );
  return parseApiPlaylist(playlist);
};

export const fetchCollectorPlaylists = async (
  collectorAddress: string,
): Promise<IPlaylist[]> => {
  const playlists = await firebaseClient.get<IApiResponsePlaylist[]>(
    `playlist?collector=${collectorAddress}`,
  );
  return playlists
    .filter(playlists => playlists.type === 'custom')
    .map(parseApiPlaylist);
};
