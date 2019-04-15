import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';
import helpers from '../helpers';

const UPDATE_AVATAR = gql`
  mutation updateAvatar($input: AvatarInput!) {
    updateAvatar(input: $input) {
      ok
      error
    }
  }
`;

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

describe('Profile Mutation', () => {
  beforeAll(helpers.beforeAll);
  afterAll(helpers.afterAll);

  describe('Update avatar mutation', () => {
    test('should fail to update avatar if user not connected', async () => {
      const avatarInput = {
        big: 'url-big',
        meduim: 'url-meduim',
        small: 'url-small',
      };
      const { mutate } = createApolloClient();
      const { data, errors } = await mutate({
        mutation: UPDATE_AVATAR,
        variables: { input: avatarInput },
      });

      expect(data).toBeNull();
      expect(errors).toBeDefined();
      // expect(errors)
      //   .toContain('[GraphQLError: You are not authorized to access this resource.]');
    });

    let accessToken;

    test('should update avatar', async () => {
      const newUserInput = {
        username: 'sadok',
        firstName: 'sadok',
        lastName: 'khouaja',
        email: 'sadok@email.com',
        password: '123456',
      };

      const { mutate } = createApolloClient();

      const { data: { register } } = await mutate({
        mutation: REGISTER,
        variables: {
          input: newUserInput,
        },
      });

      expect(register.ok).toBeTruthy();
      expect(register.error).toBeNull();
      expect(register.session.token).toBeDefined();

      accessToken = register.session.token;

      const { mutate: loggedMutate, query } = createApolloClient(accessToken);

      const avatarInput = {
        big: 'url-big',
        meduim: 'url-meduim',
        small: 'url-small',
      };

      const { data: { updateAvatar } } = await loggedMutate({
        mutation: UPDATE_AVATAR,
        variables: { input: avatarInput },
      });

      expect(updateAvatar.ok).toBeTruthy();
      expect(updateAvatar.error).toBeNull();

      const { data: { me } } = await query({
        query: ME_WITH_AVATAR,
      });

      expect(me.id).toBeDefined();
      expect(me.username).toEqual(newUserInput.username);
      expect(me.avatar.big.url).toEqual(avatarInput.big);
      expect(me.avatar.meduim.url).toEqual(avatarInput.meduim);
      expect(me.avatar.small.url).toEqual(avatarInput.small);
    });

    test('should update avatar second time', async () => {
      const { mutate, query } = createApolloClient(accessToken);
      const avatarInput = {
        big: 'url-big-2',
        meduim: 'url-meduim-2',
        small: 'url-small-2',
      };

      const { data: { updateAvatar } } = await mutate({
        mutation: UPDATE_AVATAR,
        variables: { input: avatarInput },
      });

      expect(updateAvatar.ok).toBeTruthy();
      expect(updateAvatar.error).toBeNull();

      const { data: { me } } = await query({
        query: ME_WITH_AVATAR,
      });

      expect(me.id).toBeDefined();
      expect(me.avatar.big.url).toEqual(avatarInput.big);
      expect(me.avatar.meduim.url).toEqual(avatarInput.meduim);
      expect(me.avatar.small.url).toEqual(avatarInput.small);
    });
    // test('sould fail if user connected but user does not exist in database')
    /**
     * hard to reproduce, but nice to have a real test
     */
  });
});
