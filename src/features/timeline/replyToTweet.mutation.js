import { gql } from 'apollo-server';
import { merge } from 'lodash';
import Tweet from '';
import TweetInput from ''

const ReplyToTweetAcknowledgement = gql`
  type ReplyToTweetAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
    tweet: Tweet
  }
`;

const replyToTweetMutation = gql`
  extend type Mutation {
    replyToTweet(tweetId: ID!, tweet: TweetInput!): ReplyToTweetAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    replyToTweet: async (_, { tweetId, TweetInput: { content, tags } }, { models, user }) => {
      try {
        const tweet = new models.Tweet({
          content,
          tags,
          owner: user.id,
          parentId: tweetId,
        });
        await tweet.save();
        return {
          ok: true,
          tweet,
        };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
  },
};

export default {
  typeDefs: [
    ReplyToTweetAcknowledgement,
    replyToTweetMutation,
    ...Tweet.typeDefs,
    ...TweetInput.typeDefs,
  ],
  resolvers: merge(
    resolvers,
    Tweet.resolvers,
    TweetInput.resolvers,
  ),
};
