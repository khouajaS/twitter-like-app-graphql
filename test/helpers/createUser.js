import { gql } from 'apollo-server';
import faker from 'faker';
import createApolloClient from '../createApolloClient';

const REGISTER = gql`
  mutation register($input: NewUserInput!) {
    register(input: $input) {
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

const createUserMutation = async ({ username, email, accessToken } = {}) => {
  const user = {
    username: username || faker.name.firstName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: email || faker.internet.email(),
    password: faker.lorem.word(),
  };

  const { mutate } = createApolloClient(accessToken ? accessToken : undefined);

  const {
    data: { register },
  } = await mutate({
    mutation: REGISTER,
    variables: {
      input: user,
    },
  });

  return {
    user,
    register,
  };
};

export default createUserMutation;
