import { gql } from 'apollo-server';

const RetweetAcknowledgement = gql`
  type RetweetAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
  }
`;

const retweetMutation = gql`
  extend type Mutation {
    retweet(tweetId: ID!): RetweetAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    retweet: async (_, { tweetId }, { models, user }) => {
      try {
        const currentTweet = await models.Tweet.findOne({ _id: tweetId });
        if (!currentTweet) {
          return {
            ok: false,
            error: 'tweet does not exist',
          };
        }
        // TODO: add retweet to original tweet
        const retweet = new models.Tweet({ isRetweet: true, parentId: tweetId, owner: user.id });
        await retweet.save();
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
  },
};

export default {
  typeDefs: [
    RetweetAcknowledgement,
    retweetMutation,
  ],
  resolvers,
};
