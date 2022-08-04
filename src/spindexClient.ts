import {GraphQLClient} from 'graphql-request';

import {config} from '@/config';

export const spindexClient = new GraphQLClient(config.SPINDEX_NODE_URL);
