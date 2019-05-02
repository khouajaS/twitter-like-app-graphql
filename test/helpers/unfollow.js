import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';

const UNFOLLOW = gql`
  mutation unfollow($userId: ID!) {
    unfollow(userId: $userId) {
      ok
      error
    }
  }
`;

const unfollowMutation = async ({ accessToken, followee } = {}) => {
  const { mutate } = createApolloClient(accessToken);
  const {
    data: { unfollow },
  } = await mutate({ mutation: UNFOLLOW, variables: { userId: followee } });

  return { unfollow };
};

export default unfollowMutation;
