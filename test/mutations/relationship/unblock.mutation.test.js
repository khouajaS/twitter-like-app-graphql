import triggers from '../../triggers';
import {
  createMultipleUsersMutation,
  blockMutation,
  meQuery,
  unblockMutation,
} from '../../helpers';

describe('Unblock Mutations', () => {
  beforeAll(triggers.beforeAll);
  afterAll(triggers.afterAll);

  test('should unblock a user not blocked', async () => {
    const [me, user] = await createMultipleUsersMutation(2);

    const { unblock } = await unblockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    expect(unblock.ok).toBeTruthy();
    expect(unblock.error).toBeNull();

    const { me: myProfile } = await meQuery(me.register.session.token);

    expect(myProfile.blocked.count).toEqual(0);
  });

  test('should unblock a user already blocked', async () => {
    const [me, user] = await createMultipleUsersMutation(2);

    await blockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    const { unblock } = await unblockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    expect(unblock.ok).toBeTruthy();
    expect(unblock.error).toBeNull();

    const { me: myProfile } = await meQuery(me.register.session.token);
    expect(myProfile.blocked.count).toEqual(0);
  });

  test('should unblock a user already unblocked', async () => {
    const [me, user] = await createMultipleUsersMutation(2);

    await blockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    await unblockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    const { unblock } = await unblockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    expect(unblock.ok).toBeTruthy();
    expect(unblock.error).toBeNull();

    const { me: myProfile } = await meQuery(me.register.session.token);

    expect(myProfile.blocked.count).toEqual(0);
  });

  test('should unblock 2 users', async () => {
    const [me, user, user2] = await createMultipleUsersMutation(3);

    await blockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    await blockMutation({
      accessToken: me.register.session.token,
      user: user2.register.session.id,
    });

    const { unblock } = await unblockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    expect(unblock.ok).toBeTruthy();
    expect(unblock.error).toBeNull();

    const { me: myProfile } = await meQuery(me.register.session.token);

    expect(myProfile.blocked.count).toEqual(1);
    expect(myProfile.blocked.list[0].id).toEqual(user2.register.session.id);

    const { unblock: unblock2 } = await unblockMutation({
      accessToken: me.register.session.token,
      user: user2.register.session.id,
    });

    expect(unblock2.ok).toBeTruthy();
    expect(unblock2.error).toBeNull();

    const { me: myProfile2 } = await meQuery(me.register.session.token);

    expect(myProfile2.blocked.count).toEqual(0);
  });
});
