import {parseApiPlaylist} from '@/modelParsers';
import {playlistApiClient} from '@/playlistApiClient';
import {fetchTracksByIds} from '@/queries/tracks';
import {IApiResponsePlaylist, IPlaylist, ITrack} from '@/types';

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
