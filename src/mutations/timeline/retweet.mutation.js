import { gql } from 'apollo-server';
import {
  buildSuccessMuationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

const RetweetAcknowledgement = gql`
  type RetweetAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
  }
`;

const retweetMutation = gql`
  extend type Mutation {
    retweet(tweetId: ID!): RetweetAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    retweet: tryCatchAsyncMutation(async (_, { tweetId }, { models, user }) => {
      const currentTweet = await models.Tweet.findOne({ _id: tweetId });
      if (!currentTweet) {
        return buildFailedMutationResponse('tweet does not exist');
      }
      // TODO: add retweet to original tweet
      const retweet = new models.Tweet({ isRetweet: true, parentId: tweetId, owner: user.id });
      await retweet.save();
      return buildSuccessMuationResponse();
    }),
  },
};

export default {
  typeDefs: [
    RetweetAcknowledgement,
    retweetMutation,
  ],
  resolvers,
};
