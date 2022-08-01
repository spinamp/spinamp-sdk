# spinamp-sdk

Set of javascript async typed functions for communication between client app and the spinamp pipeline.

# Models

### IArtist

Object describing artist entity,

```
interface IArtist {
    id: string;
    name: string;
    createdAtTime: string;
    slug: string;
    profiles: {
        [platformId: string]: IArtistProfile;
    };
}
```

### IArtistProfile

Object containing information about artist profile based on data from particular platform. One artist can own multiples profiles assigned if he uploaded tracks for multiple platforms.

```
interface IArtistProfile {
    platformId: string;
    platformInternalId: string;
    name: string;
    createdAtTime: string;
    avatarUrl?: string;
    websiteUrl?: string;
}
```

### ITrack

Object describing track entity.

```
interface ITrack {
    id: string;
    platformInternalId: string;
    title: string;
    slug: string;
    platformId: string;
    artistId: string;
    artist: IArtist;
    lossyAudioUrl: string;
    lossyArtworkUrl?: string;
    description?: string;
    createdAtTime?: string;
    websiteUrl?: string;
}
```

### ICollectionTrack

Object describing track from nft collection of particular address owner. It's the same as `ITrack` but extended with `quantity` property. 

```
interface ICollectionTrack extends ITrack {
    quantity: number;
}
```

### IMusicPlatformData

Object containing information about platform id and it's corresponding name.

```
interface IMusicPlatformData {
    id: string;
    name: string;
}
```

### IPlaylist

Object describing playlist entity

```
interface IPlaylist {
    id: string;
    title: string;
    trackIds: string[];
    collector?: string; // address of user who created playlist
}
```

### IApiListQueryParams

Set of parameters which can be passed to queries which return list of objects (`fetchAllArtists`, `fetchAllTracks`). It can be used for pagination, sorting and filtering.

Exact shape of `filter` and `orderBy` params depends on query and it can be found in API documentation of spinamp pipeline: https://open-api.spinamp.xyz/graphiql.

```
interface IApiListQueryParams {
    after?: string;
    before?: string;
    first?: number;
    last?: number;
    offset?: number;
    filter?: unknown;
    orderBy?: string[];
}
```

### IApiListQueryResponse

Object returned from queries returning list of items. It contains data which can be used for pagination.

```
interface IApiListQueryResponse<ListItem> {
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
  items: ListItem[];
}
```

# API

## Tracks

### fetchAllTracks(params: IApiListQueryParams): Promise<IApiListQueryResponse< ITrack>>

If no params are provided, returns list of all tracks existing in the database. Params can be used for pagination, filtering and sorting.

Allowed properties for `filter` and `orderBy` params can be found under `allProcessedTracks` query on spinamp pipeline API documentation: https://open-api.spinamp.xyz/graphiql.

### fetchTrackById(trackId: string): Promise<ITrack | null>

Returns full track object based on track id or `null` if such id doesn't exist.

### fetchTrackBySlug(slug: string): Promise<ITrack | null>

Returns full track object based on track slug or `null` if such slug doesn't exist.

### fetchTrackBySlugOrId(slugOrId: string): Promise<ITrack | null>

It first tries to find a track using provided param as slug. If not found, then it tries to find by id. 

### fetchTrackByIdOrSlug(IdOrSlug: string): Promise<ITrack | null>

The same as above, but it first tries to find track by id.

### fetchTracksByIds(trackIds: string[]): Promise<ITrack[]>

Returns list of full track objects based on provided list of track ids.

## Artists

### fetchAllArtists(params: IApiListQueryParams): Promise<IApiListQueryResponse< IArtist>>

If no params are provided, returns list of all artists existing in the database. Params can be used for pagination, filtering and sorting

Allowed properties for `filter` and `orderBy` params can be found under `allTracks` query on spinamp pipeline API documentation: https://open-api.spinamp.xyz/graphiql.

### fetchArtistById(artistId: string): Promise<IArtist | null>

Returns full artist object based on artist id or `null` if such id doesn't exist.

### fetchArtistBySlug(slug: string): Promise<IArtist | null>

Returns full artist object based on track slug or `null` if such slug doesn't exist.

### fetchArtistBySlugOrId(slugOrId: string): Promise<IArtist | null>

It first tries to find an artist using provided param as slug. If not found, then it tries to find by id.

### fetchArtistByIdOrSlug(idOrSlug: string): Promise<IArtist | null>

The same as above, but it first tries to find artist by id.

### fetchArtistTracks(artistId: string): Promise<ITrack[]>

Returns list of full tracks objects created by provided artist.

### fetchArtistWithTracks(idOrSlug: string): Promise<{artist: IArtist | null, tracks: ITrack[]}>

Returns both full artist object and artist tracks list based on provided slug or id.

## Collection

### fetchCollectionForAddress(ethAddress: string): Promise<ICollectionTrack[]>

Returns list of full track objects (including quantity) owned by provided ethereum address.

## Platforms

### fetchAllPlatforms(): Promise<IMusicPlatformData[]>

Returns list of all platforms, which tracks exist in spinamp database.

### fetchPlatformById(platformId: string): Promise<IMusicPlatformData>

Returns information about particular platform based on provided platform id.

## Playlists

### fetchFeaturedPlaylists(): Promise<IPlaylist[]>

Returns list of currently promoted playlists.

### fetchPlaylistById(id: string): Promise<{playlist: IPlaylist, playlistTracks: ITrack[]}>

Gets playlist by provided playlist id. Returns `playlist` object and list of full tracks belonging to this playlist.

### fetchCollectorPlaylists(collectorAddress: string): Promise<IPlaylist[]>

Returns list of playlists created by user whit provided address.
