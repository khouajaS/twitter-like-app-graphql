import { gql } from 'apollo-server';
import { Task } from 'fawn';
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
      await Task()
        .save(models.Tweet, {
          isRetweet: true,
          parentId: tweetId,
          owner: user.id,
        })
        .update(models.Tweet, { _id: tweetId }, { $addToSet: { retweets: { $ojFuture: '0._id' } } })
        .run();

      return buildSuccessMutationResponse();
    }),
  },
};

export default {
  typeDefs: [RetweetAcknowledgement, retweetMutation],
  resolvers,
};
