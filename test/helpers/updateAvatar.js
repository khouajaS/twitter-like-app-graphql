import { gql } from 'apollo-server';
import { get } from 'lodash';
import faker from 'faker';
import createApolloClient from '../createApolloClient';

const UPDATE_AVATAR = gql`
  mutation updateAvatar($input: AvatarInput!) {
    updateAvatar(input: $input) {
      ok
      error
    }
  }
`;

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

export default updateAvatarMutation;
