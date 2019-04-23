import { gql } from 'apollo-server';
import { merge } from 'lodash';
import User from '../../types/user.type'; // cyclic dependency
import TweetInput from './tweet.input';
import { buildSuccessMuationResponse, tryCatchAsyncMutation } from '../utils';

const TweetAddedAcknowledgement = gql`
  type TweetAddedAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
    tweet: Tweet
  }
`;

const newTweetMutation = gql`
  extend type Mutation {
    newTweet(input: TweetInput!): TweetAddedAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    newTweet: tryCatchAsyncMutation(
      async (_, { input: { content, tags } }, { models, user }) => {
        const tweet = new models.Tweet({ content, tags, owner: user.id });
        await tweet.save();
        return buildSuccessMuationResponse({ tweet });
      },
    ),
  },
};

export default {
  typeDefs: [
    TweetAddedAcknowledgement,
    newTweetMutation,
    ...User.typeDefs,
    ...TweetInput.typeDefs,
  ],
  resolvers: merge(resolvers, User.resolvers, TweetInput.resolvers),
};
