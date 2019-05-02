import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';

const BLOCK = gql`
  mutation block($userId: ID!) {
    block(userId: $userId) {
      ok
      error
    }
  }
`;

const blockMutation = async ({ accessToken, user } = {}) => {
  const { mutate } = createApolloClient(accessToken);
  const {
    data: { block },
  } = await mutate({ mutation: BLOCK, variables: { userId: user } });

  return { block };
};

export default blockMutation;
