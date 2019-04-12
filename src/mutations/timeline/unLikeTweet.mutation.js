import { gql } from 'apollo-server';

const TweetUnLikedAcknowledgement = gql`
  type TweetUnLikedAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
  }
`;

const unLikeTweetMutation = gql`
  extend type Mutation {
    unLikeTweet(tweetId: ID!): TweetUnLikedAcknowledgement!
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
    TweetUnLikedAcknowledgement,
    unLikeTweetMutation,
  ],
  resolvers,
};
