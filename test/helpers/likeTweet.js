import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';

const LIKE_TWEET = gql`
  mutation likeTweet($tweetId: ID!) {
    likeTweet(tweetId: $tweetId) {
      ok
      error
    }
  }
`;

const likeTweetMutation = async ({ accessToken, tweet }) => {
  const { mutate } = createApolloClient(accessToken);

  const {
    data: { likeTweet },
  } = await mutate({
    mutation: LIKE_TWEET,
    variables: { tweetId: tweet },
  });

  return { likeTweet };
};

export default likeTweetMutation;
