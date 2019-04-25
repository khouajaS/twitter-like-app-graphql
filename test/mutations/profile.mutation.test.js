import helpers from '../helpers';
import {
  createUserMutation,
  updateAvatarMutation,
  meWithAvatarQuery,
} from './utils';

describe('Profile Mutation', () => {
  beforeAll(helpers.beforeAll);
  afterAll(helpers.afterAll);

  describe('Update avatar mutation', () => {
    test('should fail to update avatar if user not connected', async () => {
      const { updateAvatar, errors } = await updateAvatarMutation();

      expect(updateAvatar).not.toBeDefined();
      expect(errors).toBeDefined();
      // expect(errors)
      //   .toContain('[GraphQLError: You are not authorized to access this resource.]');
    });

    test('should update avatar', async () => {
      const { register, user } = await createUserMutation();
      const { avatar, updateAvatar } = await updateAvatarMutation({
        accessToken: register.session.token,
      });

      expect(updateAvatar.ok).toBeTruthy();
      expect(updateAvatar.error).toBeNull();

      const { me } = await meWithAvatarQuery(register.session.token);

      expect(me.id).toBeDefined();
      expect(me.username).toEqual(user.username);
      expect(me.avatar.big.url).toEqual(avatar.big);
      expect(me.avatar.meduim.url).toEqual(avatar.meduim);
      expect(me.avatar.small.url).toEqual(avatar.small);
    });

    test('should update avatar second time', async () => {
      const { register } = await createUserMutation();
      await updateAvatarMutation({
        accessToken: register.session.token,
      });

      const { avatar, updateAvatar } = await updateAvatarMutation({
        accessToken: register.session.token,
      });

      expect(updateAvatar.ok).toBeTruthy();
      expect(updateAvatar.error).toBeNull();

      const { me } = await meWithAvatarQuery(register.session.token);

      expect(me.id).toBeDefined();
      expect(me.avatar.big.url).toEqual(avatar.big);
      expect(me.avatar.meduim.url).toEqual(avatar.meduim);
      expect(me.avatar.small.url).toEqual(avatar.small);
    });
    // test('sould fail if user connected but user does not exist in database')
    /**
     * hard to reproduce, but nice to have a real test
     */
  });
});
