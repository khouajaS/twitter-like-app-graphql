import triggers from '../../triggers';
import { createUserMutation } from '../../helpers';

describe('Register Mutations', () => {
  beforeAll(triggers.beforeAll);
  afterAll(triggers.afterAll);

  const uniqEmail = 'email@email.com';
  const uniqUsername = 'joe';

  test('should add new User', async () => {
    const { user, register } = await createUserMutation({
      email: uniqEmail,
      username: uniqUsername,
    });
    expect(register.ok).toBeTruthy();
    expect(register.error).toBeNull();
    expect(register.session.token).toBeDefined();
    expect(register.session.id).toBeDefined();
    expect(register.session.email).toEqual(user.email);
    expect(register.session.username).toEqual(user.username);
  });

  test('should not add new user with the same email', async () => {
    const { register } = await createUserMutation({
      email: uniqEmail,
    });

    expect(register.ok).not.toBeTruthy();
    expect(register.session).toBeNull();
    expect(register.error).not.toBeNull();
    // expect(register.error).toEqual(
    //   'MongoError: E11000 duplicate key error collection: twitter-test.users index: email_1 dup key: { : "sadok@email.com" }',
    // );
  });

  test('should not add new user with the same username', async () => {
    const { register } = await createUserMutation({ username: uniqUsername });

    expect(register.ok).not.toBeTruthy();
    expect(register.session).toBeNull();
    expect(register.error).not.toBeNull();
    // expect(register.error).toEqual(
    //   'MongoError: E11000 duplicate key error collection: twitter-test.users index: username_1 dup key: { : "sadok" }',
    // );
  });

  test('should add an other user', async () => {
    const { user, register } = await createUserMutation();

    expect(register.ok).toBeTruthy();
    expect(register.error).toBeNull();
    expect(register.session.token).toBeDefined();
    expect(register.session.id).toBeDefined();
    expect(register.session.email).toEqual(user.email);
    expect(register.session.username).toEqual(user.username);
  });

  test('should not access to register mutation if user was already connected', async () => {
    const { register: initial } = await createUserMutation();

    const { register } = await createUserMutation({
      accessToken: initial.session.token,
    });

    expect(register.ok).not.toBeTruthy();
    expect(register.session).toBeNull();
    expect(register.error).not.toBeNull();
    expect(register.error).toEqual('Already connected');
  });
});
