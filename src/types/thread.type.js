import { gql } from 'apollo-server';

const Thread = gql`
  type Thread {
    tweet: Tweet
    replies: [Thread]
  }
`;

const resolvers = {
  Thread: {
    tweet: (parent) => parent,
    replies: ({ _id: parentId }, _, { models }) => models.Tweet.find({ parentId }),
  },
};

export default {
  typeDefs: [Thread],
  resolvers,
};
