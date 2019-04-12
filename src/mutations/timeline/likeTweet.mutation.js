import { gql } from 'apollo-server';
import {
  buildSuccessMuationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

const TweetLikedAcknowledgement = gql`
  type TweetLikedAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const likeTweetMutation = gql`
  extend type Mutation {
    likeTweet(tweetId: ID!): TweetLikedAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    likeTweet: tryCatchAsyncMutation(async (_, { tweetId }, { models, user }) => {
      const { nModified } = await models.Tweet
        .update({ _id: tweetId }, { $addToSet: { likes: user.id } });
      if (nModified === 0) {
        return buildFailedMutationResponse('tweet does not exist or liked before');
      }
      return buildSuccessMuationResponse();
    }),
  },
};

export default {
  typeDefs: [
    TweetLikedAcknowledgement,
    likeTweetMutation,
  ],
  resolvers,
};
