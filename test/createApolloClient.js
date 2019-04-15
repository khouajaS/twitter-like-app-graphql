import { createTestClient } from 'apollo-server-testing';
import createApolloServer from '../src/server';

const createApolloClient = token => createTestClient(createApolloServer(token));

export default createApolloClient;
