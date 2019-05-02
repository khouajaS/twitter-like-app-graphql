import triggers from '../../triggers';
import { createMultipleUsersMutation, blockMutation, meQuery } from '../../helpers';

describe('Block Mutations', () => {
  beforeAll(triggers.beforeAll);
  afterAll(triggers.afterAll);

  test('should block a user', async () => {
    const [me, user] = await createMultipleUsersMutation(2);
    const { block } = await blockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    expect(block.ok).toBeTruthy();
    expect(block.error).toBeNull();

    const { me: myProfile } = await meQuery(me.register.session.token);

    expect(myProfile.blocked.count).toEqual(1);
    expect(myProfile.blocked.list[0].id).toEqual(user.register.session.id);
  });

  test('should block a user already blocked', async () => {
    const [me, user] = await createMultipleUsersMutation(2);
    await blockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    const { block } = await blockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    expect(block.ok).toBeTruthy();
    expect(block.error).toBeNull();

    const { me: myProfile } = await meQuery(me.register.session.token);

    expect(myProfile.blocked.count).toEqual(1);
    expect(myProfile.blocked.list[0].id).toEqual(user.register.session.id);
  });

  test('should block 2 users', async () => {
    const [me, user, user2] = await createMultipleUsersMutation(3);

    await blockMutation({
      accessToken: me.register.session.token,
      user: user.register.session.id,
    });

    const { block } = await blockMutation({
      accessToken: me.register.session.token,
      user: user2.register.session.id,
    });

    expect(block.ok).toBeTruthy();
    expect(block.error).toBeNull();

    const { me: myProfile } = await meQuery(me.register.session.token);
    expect(myProfile.blocked.count).toEqual(2);

    expect(myProfile.blocked.list.map((user) => user.id)).toEqual(
      expect.arrayContaining([user.register.session.id, user2.register.session.id]),
    );
  });
});
