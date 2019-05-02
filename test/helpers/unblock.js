import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';

const UNBLOCK = gql`
  mutation unblock($userId: ID!) {
    unblock(userId: $userId) {
      ok
      error
    }
  }
`;

const unblockMutation = async ({ accessToken, user } = {}) => {
  const { mutate } = createApolloClient(accessToken);
  const {
    data: { unblock },
  } = await mutate({ mutation: UNBLOCK, variables: { userId: user } });

  return { unblock };
};

export default unblockMutation;
