import { gql } from 'apollo-server';
import {
  buildSuccessMuationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

const TweetUnLikedAcknowledgement = gql`
  type TweetUnLikedAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
  }
`;

const unLikeTweetMutation = gql`
  extend type Mutation {
    unLikeTweet(tweetId: ID!): TweetUnLikedAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    retweet: tryCatchAsyncMutation(async (_, { tweetId }, { models, user }) => {
      const currentTweet = await models.Tweet.findOne({ _id: tweetId });
      if (!currentTweet) {
        return buildFailedMutationResponse('tweet does not exist');
      }

      const retweet = new models.Tweet({ isRetweet: true, parentId: tweetId, owner: user.id });
      await retweet.save();
      return buildSuccessMuationResponse();
    }),
  },
};

export default {
  typeDefs: [
    TweetUnLikedAcknowledgement,
    unLikeTweetMutation,
  ],
  resolvers,
};
