import { gql } from 'apollo-server';
import faker from 'faker';
import createApolloClient from '../createApolloClient';

const NEW_TWEET = gql`
  mutation newTweet($input: TweetInput!) {
    newTweet(input: $input) {
      ok
      error
      tweet {
        id
        content
        isRetweet
        tags {
          id
        }
        owner {
          id
        }
        likes {
          count
        }
        replies {
          tweet {
            id
          }
        }
        retweets {
          count
        }
        createdAt
      }
    }
  }
`;

const createNewTweetMutation = async ({ accessToken, content, tags = [] } = {}) => {
  const tweet = {
    content: content || faker.lorem.paragraph(),
    tags,
  };

  const { mutate } = createApolloClient(accessToken ? accessToken : undefined);

  const {
    data: { newTweet },
  } = await mutate({
    mutation: NEW_TWEET,
    variables: {
      input: tweet,
    },
  });

  return { tweet, newTweet };
};

export default createNewTweetMutation;
