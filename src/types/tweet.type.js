import { gql } from 'apollo-server';
import { merge } from 'lodash';
import Thread from './thread.type';

const Retweets = gql`
  type Retweets {
    count: Int
    list: [Tweet]
  }
`;

const Likes = gql`
  type Likes {
    count: Int
    list: [User]
  }
`;

const Tweet = gql`
  type Tweet {
    id: ID!
    content: String
    isRetweet: Boolean
    owner: User
    tags: [User]
    likes: Likes
    retweets: Retweets
    replies: [Thread]
    createdAt: String
  }
`;

const resolvers = {
  Tweet: {
    owner: ({ owner }, _, { models }) => models.User.findOne({ _id: owner }),
    tags: ({ tags }, _, { models }) => {
      if (tags && tags.length && tags.length > 0) {
        return models.User.find({ _id: { $in: tags } });
      }
      return [];
    },
    replies: ({ _id: parentId }, _, { models }) => models.Tweet.find({ parentId }),
  },
  Likes: {
    count: (parent) => parent.length || 0,
    list: (likes, _, { models }) => {
      if (likes && likes.length && likes.length > 0) {
        return models.User.find({ _id: { $in: likes } });
      }
      return [];
    },
  },
  Retweets: {
    count: (parent) => parent.length || 0,
    list: (retweets, _, { models }) => {
      if (retweets && retweets.length && retweets.length > 0) {
        return models.Tweet.find({ _id: { $in: retweets }, isRetweet: true });
      }
      return [];
    },
  },
};

export default {
  typeDefs: [Retweets, Likes, Tweet, ...Thread.typeDefs],
  resolvers: merge(resolvers, Thread.resolvers),
};
