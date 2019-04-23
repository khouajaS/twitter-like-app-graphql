import { gql } from 'apollo-server';
import { merge } from 'lodash';
import User from '../types/user.type'; // cyclic dependency

const tweetQuery = gql`
  extend type Query {
    tweet(id: ID): Tweet
  }
`;

const resolvers = {
  Query: {
    tweet: (_, { id }, { models }) => models.Tweet.findOne({ _id: id }),
  },
};

export default {
  typeDefs: [tweetQuery, ...User.typeDefs],
  resolvers: merge(resolvers, User.resolvers),
};
