import { gql } from 'apollo-server';
import {
  buildSuccessMutationResponse,
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
      // TODO: transaction
      const retweet = new models.Tweet({
        isRetweet: true,
        parentId: tweetId,
        owner: user.id,
      });
      await retweet.save();
      models.Tweet.update({ _id: tweetId }, { $addToSet: { retweets: retweet.id } });
      return buildSuccessMutationResponse();
    }),
  },
};

export default {
  typeDefs: [RetweetAcknowledgement, retweetMutation],
  resolvers,
};
