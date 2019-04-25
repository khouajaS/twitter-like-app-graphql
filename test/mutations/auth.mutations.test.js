import { createUserMutation, loginMutation } from './utils';
import helpers from '../helpers';

describe('Auth Mutations', () => {
  describe('Register Mutations', () => {
    beforeAll(helpers.beforeAll);
    afterAll(helpers.afterAll);

    test('should add new User', async () => {
      const { user, register } = await createUserMutation({
        email: 'email@email.com',
        username: 'joe',
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
        email: 'email@email.com',
      });

      expect(register.ok).not.toBeTruthy();
      expect(register.session).toBeNull();
      expect(register.error).not.toBeNull();
      // expect(register.error).toEqual(
      //   'MongoError: E11000 duplicate key error collection: twitter-test.users index: email_1 dup key: { : "sadok@email.com" }',
      // );
    });

    test('should not add new user with the same username', async () => {
      const { register } = await createUserMutation({ username: 'joe' });

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
      const { user, register: initial } = await createUserMutation();

      const { register } = await createUserMutation({
        accessToken: initial.session.token,
      });

      expect(register.ok).not.toBeTruthy();
      expect(register.session).toBeNull();
      expect(register.error).not.toBeNull();
      expect(register.error).toEqual('Already connected');
    });
  });

  describe('Login Mutations', () => {
    beforeAll(helpers.beforeAll);
    afterAll(helpers.afterAll);

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
});
