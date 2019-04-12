import { gql } from 'apollo-server';
import { merge } from 'lodash';
import Tweet from './tweet.type';

const User = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    fullName: String!
    email: String!
    avatar: Avatar!
    tweets: [Tweet]
    following: ListUser!
    followers: ListUser!
    bloqued: ListUser!
  }
`;

const Picture = gql`
  type Picture {
    url: String
  }
`;

const Avatar = gql`
  type Avatar {
    big: Picture
    meduim: Picture
    small: Picture
  }
`;

const ListUser = gql`
  type ListUser {
    count: Int!
    list: [User]!
  }
`;

const resolvers = {
  User: {
    fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    tweets: (_, $, { models, user }) => models.Tweet.find({ owner: user.id }),
  },
  Picture: {
    url: url => ({ url }),
  },
  ListUser: {
    count: list => (list ? list.length || 0 : 0),
    list: (list, _, { models }) => {
      if (list && list.length && list.length > 0) {
        return models.User.find({ _id: { $in: list } });
      }
      return [];
    },
  },
};

export default {
  typeDefs: [
    Picture,
    Avatar,
    ListUser,
    User,
    ...Tweet.typeDefs,
  ],
  resolvers: merge(resolvers, Tweet.resolvers),
};
