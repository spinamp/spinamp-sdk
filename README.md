# @spinamp/spinamp-sdk

Spinamp-SDK is a javascript client sdk for the growing web3 music ecosystem. It provides access to Spinamp's Spindexer API, which includes music nft activity, music content and metadata, including:
 - Music NFT mints, transfers (sales/bids coming soon)
 - Artist data and profiles, which are aggregated across all their cross-platform activity into cohesive, discographic views.
 - Track data and metadata, including optimized audio and images with a fast CDN for great UX

Additionally, it has early support for the Playlisting API for viewing and creating users playlists

## Installation
The package can be installed using yarn or npm:
```
yarn add @spinamp/spinamp-sdk
```

or

```
npm i @spinamp/spinamp-sdk
```

## Usage
To use any function (or type) from the SDK just simply use named imports, for example:
```
import {fetchTrackBySlug, ITrack} from '@spinamp/spinamp-sdk';

fetchTrackBySlug('loaded').then((track: ITrack | null) => {
    console.log(track);
});
```

For further usage examples and comprehensive API Reference, see the [documentation](https://spinamp.gitbook.io/spinamp-sdk/).
