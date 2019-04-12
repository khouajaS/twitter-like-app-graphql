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
    removeTweet(tweetId: ID!): removeTweetAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    removeTweet: tryCatchAsyncMutation(async (_, { tweetId }, { models, user }) => {
      const { nRemoved } = await models.Tweet.remove({ _id: tweetId, owner: user.id });
      if (nRemoved === 0) {
        return buildFailedMutationResponse('tweet does not exist or not yours!');
      }
      return buildSuccessMuationResponse();
    }),
  },
};

export default {
  typeDefs: [
    removeTweetAcknowledgement,
    removeTweetMutation,
  ],
  resolvers,
};
