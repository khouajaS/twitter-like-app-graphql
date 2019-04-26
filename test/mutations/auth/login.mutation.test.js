import triggers from '../../triggers';
import { createUserMutation, loginMutation } from '../../helpers';

describe('Login Mutations', () => {
  beforeAll(triggers.beforeAll);
  afterAll(triggers.afterAll);

  test('should return error if user does not exist', async () => {
    const { user } = await createUserMutation();

    const { login } = await loginMutation({
      identifiant: user.username + 'x',
      password: 'random',
    });

    expect(login.ok).not.toBeTruthy();
    expect(login.error).not.toBeNull();
    expect(login.error).toEqual('bad credentials');
    expect(login.session).toBeNull();
  });

  test('should return error if password is wrong', async () => {
    const { user } = await createUserMutation();
    const { login } = await loginMutation({
      identifiant: user.username,
      password: user.password + 'x',
    });

    expect(login.ok).not.toBeTruthy();
    expect(login.error).not.toBeNull();
    expect(login.error).toEqual('bad credentials');
    expect(login.session).toBeNull();
  });

  test('should connect with email', async () => {
    const { user } = await createUserMutation();
    const { login } = await loginMutation({
      identifiant: user.email,
      password: user.password,
    });

    expect(login.ok).toBeTruthy();
    expect(login.error).toBeNull();
    expect(login.session.id).toBeDefined();
    expect(login.session.token).toBeDefined();
    expect(login.session.email).toEqual(user.email);
    expect(login.session.username).toEqual(user.username);
  });

  test('should connect with username', async () => {
    const { user } = await createUserMutation();
    const { login } = await loginMutation({
      identifiant: user.username,
      password: user.password,
    });

    expect(login.ok).toBeTruthy();
    expect(login.error).toBeNull();
    expect(login.session.id).toBeDefined();
    expect(login.session.token).toBeDefined();
    expect(login.session.username).toEqual(user.username);
    expect(login.session.email).toEqual(user.email);
  });

  test('should not access to login mutation if user was already connected', async () => {
    const { user, register } = await createUserMutation();
    const { login } = await loginMutation({
      identifiant: user.username,
      password: user.password,
      accessToken: register.session.token,
    });

    expect(login.ok).not.toBeTruthy();
    expect(login.session).toBeNull();
    expect(login.error).not.toBeNull();
    expect(login.error).toEqual('Already connected');
  });
});
