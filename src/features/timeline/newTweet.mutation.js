import { gql } from 'apollo-server';
import { merge } from 'lodash';
import Tweet from '';

const TweetAddedAcknowledgement = gql`
  type TweetAddedAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
    tweet: Tweet
  }
`;

const newTweetMutation = gql`
  extend type Mutation {
    newTweet(input: TweetInput!): TweetAddedAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    newTweet: async (_, { input: { content, tags } }, { models, user }) => {
      try {
        const tweet = new models.Tweet({ content, tags, owner: user.id });
        await tweet.save();
        return { ok: true, tweet };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
  },
};

export default {
  typeDefs: [
    TweetAddedAcknowledgement,
    newTweetMutation,
    ...Tweet.typeDefs,
  ],
  resolvers: merge(resolvers, Tweet.resolvers),
};
