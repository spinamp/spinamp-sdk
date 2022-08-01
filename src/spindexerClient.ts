import {GraphQLClient} from 'graphql-request';

import {config} from '@/config';

export const spindexerClient = new GraphQLClient(config.SPINDEXER_NODE_URL);
