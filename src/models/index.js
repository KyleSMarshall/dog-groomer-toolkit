// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Event, Client, Dog } = initSchema(schema);

export {
  Event,
  Client,
  Dog
};