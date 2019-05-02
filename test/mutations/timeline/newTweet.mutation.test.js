import triggers from '../../triggers';
import {
  createMultipleUsersMutation,
  createUserMutation,
  createNewTweetMutation,
  meQuery,
} from '../../helpers';

describe('New Tweet Mutations', () => {
  beforeAll(triggers.beforeAll);
  afterAll(triggers.afterAll);

  test('sould add new tweet without tags', async () => {
    const { register } = await createUserMutation();

    const { newTweet, tweet } = await createNewTweetMutation({
      accessToken: register.session.token,
      tags: [],
    });

    expect(newTweet.ok).toBeTruthy();
    expect(newTweet.error).toBeNull();
    expect(newTweet.tweet.id).toBeDefined();
    expect(newTweet.tweet.owner.id).toEqual(register.session.id);
    expect(newTweet.tweet.content).toEqual(tweet.content);
    expect(newTweet.tweet.tags).toEqual([]);
    expect(newTweet.tweet.isRetweet).toEqual(false);
  });

  test('sould add new tweet with tags', async () => {
    const [
      me,
      {
        register: {
          session: { id },
        },
      },
      {
        register: {
          session: { id: id2 },
        },
      },
    ] = await createMultipleUsersMutation(3);

    const { newTweet, tweet } = await createNewTweetMutation({
      accessToken: me.register.session.token,
      tags: [id, id2],
    });

    expect(newTweet.ok).toBeTruthy();
    expect(newTweet.error).toBeNull();
    expect(newTweet.tweet.id).toBeDefined();
    expect(newTweet.tweet.owner.id).toEqual(me.register.session.id);
    expect(newTweet.tweet.content).toEqual(tweet.content);
    expect(newTweet.tweet.tags.map((user) => user.id)).toEqual(expect.arrayContaining([id, id2]));
    expect(newTweet.tweet.isRetweet).toEqual(false);
  });

  test('should add 2 tweets', async () => {
    const { register } = await createUserMutation();

    const tweet = await createNewTweetMutation({
      accessToken: register.session.token,
      tags: [],
    });

    const tweet2 = await createNewTweetMutation({
      accessToken: register.session.token,
      tags: [],
    });

    expect(tweet2.newTweet.ok).toBeTruthy();
    expect(tweet2.newTweet.error).toBeNull();

    const {
      me: { tweets },
    } = await meQuery(register.session.token);

    expect(tweets.length).toEqual(2);
    expect(tweets.map((tweet) => tweet.id)).toEqual(
      expect.arrayContaining([tweet.newTweet.tweet.id, tweet2.newTweet.tweet.id]),
    );
  });
});
