import {gql} from 'graphql-request';

import {pipelineClient} from '@/pipelineClient';
import {IMusicPlatformData} from '@/types';

export const fetchAllPlatforms = async (): Promise<IMusicPlatformData[]> => {
  const response = await pipelineClient.request(gql`
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
): Promise<{id: string; name: string}> => {
  const response = await pipelineClient.request(gql`
    query PlatformById {
      platformById(id: "${id}") {
        id
        name
      }
    }
  `);

  return response.platformById;
};
