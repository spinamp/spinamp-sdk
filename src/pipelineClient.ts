import {GraphQLClient} from 'graphql-request';

import {config} from '@/config';

export const pipelineClient = new GraphQLClient(config.PIPELINE_URL);
