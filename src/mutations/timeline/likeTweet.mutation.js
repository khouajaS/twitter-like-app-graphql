import { gql } from 'apollo-server';

const TweetLikedAcknowledgement = gql`
  type TweetLikedAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const likeTweetMutation = gql`
  extend type Mutation {
    likeTweet(tweetId: ID!): TweetLikedAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    likeTweet: async (_, { tweetId }, { models, user }) => {
      try {
        const { nModified } = await models.Tweet
          .update({ _id: tweetId }, { $addToSet: { likes: user.id } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'tweet does not exist or liked before',
          };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
  },
};

export default {
  typeDefs: [
    TweetLikedAcknowledgement,
    likeTweetMutation,
  ],
  resolvers,
};
