import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';

const LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      session {
        id
        token
        username
        email
      }
    }
  }
`;

const loginMutation = async ({ identifiant, password, accessToken } = {}) => {
  const credentials = { identifiant, password };
  const { mutate } = createApolloClient(accessToken ? accessToken : undefined);

  const {
    data: { login },
  } = await mutate({
    mutation: LOGIN,
    variables: {
      input: credentials,
    },
  });

  return { login };
};

export default loginMutation;
