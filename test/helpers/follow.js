import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';

const FOLLOW = gql`
  mutation follow($userId: ID!) {
    follow(userId: $userId) {
      ok
      error
    }
  }
`;

const followMutation = async ({ accessToken, followee } = {}) => {
  const { mutate } = createApolloClient(accessToken);
  const {
    data: { follow },
  } = await mutate({ mutation: FOLLOW, variables: { userId: followee } });

  return { follow };
};

export default followMutation;
