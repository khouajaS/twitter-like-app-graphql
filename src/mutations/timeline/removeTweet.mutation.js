import { gql } from 'apollo-server';
import {
  buildSuccessMuationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

const removeTweetAcknowledgement = gql`
  type removeTweetAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
  }
`;

const removeTweetMutation = gql`
  extend type Mutation {
    removeTweet(tweetId: ID!): removeTweetAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    removeTweet: async (_, { tweetId }, { models, user }) => {
      try {
        const { nRemoved } = await models.Tweet.remove({ _id: tweetId, owner: user.id });
        if (nRemoved === 0) {
          return {
            ok: false,
            error: 'tweet does not exist or not yours!',
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
    removeTweetAcknowledgement,
    removeTweetMutation,
  ],
  resolvers,
};
