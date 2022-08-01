import {firebaseClient} from '@/firebaseClient';
import {parseApiPlaylist} from '@/modelParsers';
import {fetchTracksByIds} from '@/queries/tracks';
import {IApiResponsePlaylist, IPlaylist, ITrack} from '@/types';

export const fetchFeaturedPlaylists = async (): Promise<IPlaylist[]> => {
  const playlists = await firebaseClient.get<IApiResponsePlaylist[]>(
    'playlist?verified=true',
  );
  return playlists.map(parseApiPlaylist);
};

export const fetchPlaylistById = async (
  playlistId: string,
): Promise<{playlist: IPlaylist; playlistTracks: ITrack[]}> => {
  const playlist = await firebaseClient.get<IApiResponsePlaylist>(
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
  const playlists = await firebaseClient.get<IApiResponsePlaylist[]>(
    `playlist?collector=${collectorAddress}`,
  );
  return playlists
    .filter(playlists => playlists.type === 'custom')
    .map(parseApiPlaylist);
};
