import triggers from '../../triggers';
import { createMultipleUsersMutation, followMutation, meWithFollowing } from '../../helpers';

describe('Follow Mutations', () => {
  beforeAll(triggers.beforeAll);
  afterAll(triggers.afterAll);

  test('should follow a followee', async () => {
    const [me, followee] = await createMultipleUsersMutation(2);

    const { follow } = await followMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    expect(follow.ok).toBeTruthy();
    expect(follow.error).toBeNull();

    const [profile, followeeProfile] = await Promise.all([
      meWithFollowing(me.register.session.token),
      meWithFollowing(followee.register.session.token),
    ]);

    expect(profile.me.followers.count).toEqual(0);
    expect(profile.me.following.count).toEqual(1);
    expect(profile.me.following.list[0].id).toEqual(followee.register.session.id);

    expect(followeeProfile.me.following.count).toEqual(0);
    expect(followeeProfile.me.followers.count).toEqual(1);
    expect(followeeProfile.me.followers.list[0].id).toEqual(me.register.session.id);
  });

  test('should not fail if followee is already followed', async () => {
    const [me, followee] = await createMultipleUsersMutation(2);

    await followMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    const { follow } = await followMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    expect(follow.ok).toBeTruthy();
    expect(follow.error).toBeNull();

    const [profile, followeeProfile] = await Promise.all([
      meWithFollowing(me.register.session.token),
      meWithFollowing(followee.register.session.token),
    ]);

    expect(profile.me.followers.count).toEqual(0);
    expect(profile.me.following.count).toEqual(1);

    expect(followeeProfile.me.following.count).toEqual(0);
    expect(followeeProfile.me.followers.count).toEqual(1);
  });

  test('should follow two followees', async () => {
    const [me, followee, followee2] = await createMultipleUsersMutation(3);

    const { follow } = await followMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    const { follow: follow2 } = await followMutation({
      accessToken: me.register.session.token,
      followee: followee2.register.session.id,
    });

    expect(follow.ok).toBeTruthy();
    expect(follow.error).toBeNull();

    expect(follow2.ok).toBeTruthy();
    expect(follow2.error).toBeNull();

    const [profile, followeeProfile, followeeProfile2] = await Promise.all([
      meWithFollowing(me.register.session.token),
      meWithFollowing(followee.register.session.token),
      meWithFollowing(followee2.register.session.token),
    ]);

    expect(profile.me.followers.count).toEqual(0);
    expect(profile.me.following.count).toEqual(2);

    expect(followeeProfile.me.following.count).toEqual(0);
    expect(followeeProfile.me.followers.count).toEqual(1);

    expect(followeeProfile2.me.following.count).toEqual(0);
    expect(followeeProfile2.me.followers.count).toEqual(1);
  });
});
