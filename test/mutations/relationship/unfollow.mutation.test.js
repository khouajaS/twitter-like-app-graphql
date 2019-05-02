import triggers from '../../triggers';
import {
  unfollowMutation,
  followMutation,
  createMultipleUsersMutation,
  meQuery,
} from '../../helpers';

describe('Unfollow Mutations', () => {
  beforeAll(triggers.beforeAll);
  afterAll(triggers.afterAll);

  test('should unfollow a followee', async () => {
    const [me, followee] = await createMultipleUsersMutation(2);

    await followMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    const { unfollow } = await unfollowMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    expect(unfollow.ok).toBeTruthy();
    expect(unfollow.error).toBeNull();

    const [profile, followeeProfile] = await Promise.all([
      meQuery(me.register.session.token),
      meQuery(followee.register.session.token),
    ]);

    expect(profile.me.followers.count).toEqual(0);
    expect(profile.me.following.count).toEqual(0);

    expect(followeeProfile.me.following.count).toEqual(0);
    expect(followeeProfile.me.followers.count).toEqual(0);
  });

  test('should unfollow a followee already unfollowed', async () => {
    const [me, followee] = await createMultipleUsersMutation(2);

    await followMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    await unfollowMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    const { unfollow } = await unfollowMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    expect(unfollow.ok).toBeTruthy();
    expect(unfollow.error).toBeNull();

    const [profile, followeeProfile] = await Promise.all([
      meQuery(me.register.session.token),
      meQuery(followee.register.session.token),
    ]);

    expect(profile.me.followers.count).toEqual(0);
    expect(profile.me.following.count).toEqual(0);

    expect(followeeProfile.me.following.count).toEqual(0);
    expect(followeeProfile.me.followers.count).toEqual(0);
  });

  test('should unfollow 2 followee', async () => {
    const [me, followee, followee2] = await createMultipleUsersMutation(3);
    await followMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });
    await followMutation({
      accessToken: me.register.session.token,
      followee: followee2.register.session.id,
    });

    const { unfollow } = await unfollowMutation({
      accessToken: me.register.session.token,
      followee: followee.register.session.id,
    });

    expect(unfollow.ok).toBeTruthy();
    expect(unfollow.error).toBeNull();

    const [profile, followeeProfile] = await Promise.all([
      meQuery(me.register.session.token),
      meQuery(followee.register.session.token),
    ]);

    expect(profile.me.followers.count).toEqual(0);
    expect(profile.me.following.count).toEqual(1);

    expect(followeeProfile.me.following.count).toEqual(0);
    expect(followeeProfile.me.followers.count).toEqual(0);

    const { unfollow: unfollow2 } = await unfollowMutation({
      accessToken: me.register.session.token,
      followee: followee2.register.session.id,
    });

    expect(unfollow2.ok).toBeTruthy();
    expect(unfollow2.error).toBeNull();

    const [myProfile, followeeProfile2] = await Promise.all([
      meQuery(me.register.session.token),
      meQuery(followee2.register.session.token),
    ]);

    expect(myProfile.me.followers.count).toEqual(0);
    expect(myProfile.me.following.count).toEqual(0);

    expect(followeeProfile2.me.following.count).toEqual(0);
    expect(followeeProfile2.me.followers.count).toEqual(0);
  });
});
