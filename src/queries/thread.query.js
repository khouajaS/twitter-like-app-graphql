import { gql } from 'apollo-server';
import { merge } from 'lodash';
import User from '../types/user.type'; // cyclic dependency

const threadQuery = gql`
  extend type Query {
    thread(id: ID!): Thread
  }
`;


const resolvers = {
  Query: {
    thread: (_, { id }, { models }) => models.Tweet.findOne({ _id: id }),
  },
};

export default {
  typeDefs: [
    threadQuery,
    ...User.typeDefs,
  ],
  resolvers: merge(resolvers, User.resolvers),
};
