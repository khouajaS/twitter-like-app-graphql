import { gql } from 'apollo-server';
import { merge } from 'lodash';
import User from '../../types/user.type'; // cyclic dependency
import TweetInput from './tweet.input';
import { buildSuccessMuationResponse, tryCatchAsyncMutation } from '../utils';

const ReplyToTweetAcknowledgement = gql`
  type ReplyToTweetAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
    tweet: Tweet
  }
`;

const replyToTweetMutation = gql`
  extend type Mutation {
    replyToTweet(
      tweetId: ID!
      tweet: TweetInput!
    ): ReplyToTweetAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    replyToTweet: tryCatchAsyncMutation(
      async (
        _,
        { tweetId, TweetInput: { content, tags } },
        { models, user },
      ) => {
        const tweet = new models.Tweet({
          content,
          tags,
          owner: user.id,
          parentId: tweetId,
        });
        await tweet.save();
        return buildSuccessMuationResponse({ tweet });
      },
    ),
  },
};

export default {
  typeDefs: [
    ReplyToTweetAcknowledgement,
    replyToTweetMutation,
    ...User.typeDefs,
    ...TweetInput.typeDefs,
  ],
  resolvers: merge(resolvers, User.resolvers, TweetInput.resolvers),
};
