import {gql} from 'graphql-request';

import {spindexClient} from '@/spindexClient';
import {IMusicPlatformData} from '@/types';

export const fetchAllPlatforms = async (): Promise<IMusicPlatformData[]> => {
  const response = await spindexClient.request(gql`
    query Platforms {
      allPlatforms {
        nodes {
          name
          id
        }
      }
    }
  `);

  return response.allPlatforms.nodes;
};

export const fetchPlatformById = async (
  id: string,
): Promise<IMusicPlatformData> => {
  const response = await spindexClient.request(gql`
    query PlatformById {
      platformById(id: "${id}") {
        id
        name
      }
    }
  `);

  return response.platformById;
};
