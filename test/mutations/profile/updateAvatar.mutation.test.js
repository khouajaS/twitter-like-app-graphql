import triggers from '../../triggers';
import { createUserMutation, updateAvatarMutation, meQuery } from '../../helpers';

describe('Update avatar mutation', () => {
  beforeAll(triggers.beforeAll);
  afterAll(triggers.afterAll);

  test('should update avatar', async () => {
    const { register, user } = await createUserMutation();
    const { avatar, updateAvatar } = await updateAvatarMutation({
      accessToken: register.session.token,
    });

    expect(updateAvatar.ok).toBeTruthy();
    expect(updateAvatar.error).toBeNull();

    const { me } = await meQuery(register.session.token);

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

    const { me } = await meQuery(register.session.token);

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
