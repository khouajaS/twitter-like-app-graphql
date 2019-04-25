import { gql } from 'apollo-server';
import { get } from 'lodash';
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

const UPDATE_AVATAR = gql`
  mutation updateAvatar($input: AvatarInput!) {
    updateAvatar(input: $input) {
      ok
      error
    }
  }
`;

const ME_WITH_AVATAR = gql`
  query me {
    me {
      id
      username
      avatar {
        big {
          url
        }
        meduim {
          url
        }
        small {
          url
        }
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

const updateAvatarMutation = async ({ accessToken } = {}) => {
  const avatar = {
    big: faker.image.avatar(),
    meduim: faker.image.avatar(),
    small: faker.image.avatar(),
  };

  const { mutate } = createApolloClient(accessToken ? accessToken : undefined);

  const { data, errors } = await mutate({
    mutation: UPDATE_AVATAR,
    variables: { input: avatar },
  });

  return {
    avatar,
    errors,
    updateAvatar: get(data, 'updateAvatar'),
  };
};

const meWithAvatarQuery = async (accessToken) => {
  const { query } = createApolloClient(accessToken);
  const {
    data: { me },
  } = await query({
    query: ME_WITH_AVATAR,
  });

  return { me };
};

export { loginMutation };
export { createUserMutation };
export { updateAvatarMutation };
export { meWithAvatarQuery };
