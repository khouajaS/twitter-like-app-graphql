import { gql } from 'apollo-server';
import { merge } from 'lodash';
import User from '../types/user.type';

const meQuery = gql`
  extend type Query {
    me: User
  }
`;


const resolvers = {
  Query: {
    me: (_, $, { models, user }) => models.User.findOne({ _id: user.id }),
  },
};

export default {
  typeDefs: [
    meQuery,
    ...User.typeDefs,
  ],
  resolvers: merge(resolvers, User.resolvers),
};
