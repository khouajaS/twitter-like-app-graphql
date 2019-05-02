import triggers from '../../triggers';
import {
  createMultipleUsersMutation,
  createUserMutation,
  createNewTweetMutation,
  likeTweetMutation,
  createObjectID,
  meQuery,
} from '../../helpers';

describe('Like Tweet Mutations', () => {
  beforeAll(triggers.beforeAll);
  afterAll(triggers.afterAll);

  test('should not like a tweet does not exist', async () => {
    const { register } = await createUserMutation();

    const { likeTweet } = await likeTweetMutation({
      accessToken: register.session.token,
      tweet: createObjectID(),
    });

    expect(likeTweet.ok).toBe(false);
    expect(likeTweet.error).toEqual('tweet does not exist or liked before');
  });

  test('should like mine tweet', async () => {
    const { register } = await createUserMutation();

    const { newTweet } = await createNewTweetMutation({ accessToken: register.session.token });

    const { likeTweet } = await likeTweetMutation({
      accessToken: register.session.token,
      tweet: newTweet.tweet.id,
    });

    expect(likeTweet.ok).toBeTruthy();
    expect(likeTweet.error).toBeNull();

    const { me } = await meQuery(register.session.token);

    expect(me.tweets.length).toEqual(1);
    expect(me.tweets[0].likes.count).toEqual(1);
    expect(me.tweets[0].likes.list[0].id).toEqual(register.session.id);
  });

  test('should like a tweet of an other user', async () => {
    const [me, user] = await createMultipleUsersMutation(2);

    const { newTweet } = await createNewTweetMutation({ accessToken: user.register.session.token });

    const { likeTweet } = await likeTweetMutation({
      accessToken: me.register.session.token,
      tweet: newTweet.tweet.id,
    });

    expect(likeTweet.ok).toBeTruthy();
    expect(likeTweet.error).toBeNull();

    const UserProfile = await meQuery(user.register.session.token);

    expect(UserProfile.me.tweets.length).toEqual(1);
    expect(UserProfile.me.tweets[0].likes.count).toEqual(1);
    expect(UserProfile.me.tweets[0].likes.list[0].id).toEqual(me.register.session.id);
  });

  test('should like a tweet already liked', async () => {
    const { register } = await createUserMutation();

    const { newTweet } = await createNewTweetMutation({ accessToken: register.session.token });

    await likeTweetMutation({
      accessToken: register.session.token,
      tweet: newTweet.tweet.id,
    });

    const { likeTweet } = await likeTweetMutation({
      accessToken: register.session.token,
      tweet: newTweet.tweet.id,
    });

    expect(likeTweet.ok).toBeTruthy();
    expect(likeTweet.error).toBeNull();

    const { me } = await meQuery(register.session.token);

    expect(me.tweets.length).toEqual(1);
    expect(me.tweets[0].likes.count).toEqual(1);
    expect(me.tweets[0].likes.list[0].id).toEqual(register.session.id);
  });

  test('should like tweet by two users', async () => {
    const [me, user, user2] = await createMultipleUsersMutation(3);

    const { newTweet } = await createNewTweetMutation({ accessToken: me.register.session.token });

    const { likeTweet } = await likeTweetMutation({
      accessToken: user.register.session.token,
      tweet: newTweet.tweet.id,
    });

    expect(likeTweet.ok).toBeTruthy();
    expect(likeTweet.error).toBeNull();

    const { likeTweet: likeTweet2 } = await likeTweetMutation({
      accessToken: user2.register.session.token,
      tweet: newTweet.tweet.id,
    });

    expect(likeTweet2.ok).toBeTruthy();
    expect(likeTweet2.error).toBeNull();

    const MyProfile = await meQuery(me.register.session.token);

    expect(MyProfile.me.tweets.length).toEqual(1);
    expect(MyProfile.me.tweets[0].likes.count).toEqual(2);
    expect(MyProfile.me.tweets[0].likes.list.map((user) => user.id)).toEqual(
      expect.arrayContaining([user.register.session.id, user2.register.session.id]),
    );
  });
});
