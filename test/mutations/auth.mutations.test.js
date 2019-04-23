import { gql } from 'apollo-server';
import createApolloClient from '../createApolloClient';
import helpers from '../helpers';

const REGISTER = gql`
  mutation register($input: NewUserInput!) {
    register(input: $input) {
      ok
      error
      session {
        id
        token
        username
        email
      }
    }
  }
`;

const LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      session {
        id
        token
        username
        email
      }
    }
  }
`;

describe('Auth Mutations', () => {
  beforeAll(helpers.beforeAll);
  afterAll(helpers.afterAll);

  describe('Register Mutations', () => {
    test('should add new User', async () => {
      const newUserInput = {
        username: 'sadok',
        firstName: 'sadok',
        lastName: 'khouaja',
        email: 'sadok@email.com',
        password: '123456',
      };

      const { mutate } = createApolloClient();

      const {
        data: { register },
      } = await mutate({
        mutation: REGISTER,
        variables: {
          input: newUserInput,
        },
      });

      expect(register.ok).toBeTruthy();
      expect(register.error).toBeNull();
      expect(register.session.token).toBeDefined();
      expect(register.session.id).toBeDefined();
      expect(register.session.email).toEqual(newUserInput.email);
      expect(register.session.username).toEqual(newUserInput.username);
    });

    test('should not add new user with the same email', async () => {
      const newUserInput = {
        username: 'sadok2',
        firstName: 'sadok',
        lastName: 'khouaja',
        email: 'sadok@email.com',
        password: '123456',
      };

      const { mutate } = createApolloClient();

      const {
        data: { register },
      } = await mutate({
        mutation: REGISTER,
        variables: {
          input: newUserInput,
        },
      });

      expect(register.ok).not.toBeTruthy();
      expect(register.session).toBeNull();
      expect(register.error).not.toBeNull();
      expect(register.error).toEqual(
        'MongoError: E11000 duplicate key error collection: twitter-test.users index: email_1 dup key: { : "sadok@email.com" }',
      );
    });
    test('should not add new user with the same username', async () => {
      const newUserInput = {
        username: 'sadok',
        firstName: 'sadok',
        lastName: 'khouaja',
        email: 'sadok2@email.com',
        password: '123456',
      };

      const { mutate } = createApolloClient();

      const {
        data: { register },
      } = await mutate({
        mutation: REGISTER,
        variables: {
          input: newUserInput,
        },
      });

      expect(register.ok).not.toBeTruthy();
      expect(register.session).toBeNull();
      expect(register.error).not.toBeNull();
      expect(register.error).toEqual(
        'MongoError: E11000 duplicate key error collection: twitter-test.users index: username_1 dup key: { : "sadok" }',
      );
    });
    test('should add an other user', async () => {
      const newUserInput = {
        username: 'sadok2',
        firstName: 'sadok',
        lastName: 'khouaja',
        email: 'sadok2@email.com',
        password: '123456',
      };

      const { mutate } = createApolloClient();

      const {
        data: { register },
      } = await mutate({
        mutation: REGISTER,
        variables: {
          input: newUserInput,
        },
      });

      expect(register.ok).toBeTruthy();
      expect(register.error).toBeNull();
      expect(register.session.token).toBeDefined();
      expect(register.session.id).toBeDefined();
      expect(register.session.email).toEqual(newUserInput.email);
      expect(register.session.username).toEqual(newUserInput.username);
    });
    test('should not access to register mutation if user was already connected', async () => {
      const credentials = {
        identifiant: 'sadok',
        password: '123456',
      };
      const { mutate } = createApolloClient();

      const {
        data: { login },
      } = await mutate({
        mutation: LOGIN,
        variables: {
          input: credentials,
        },
      });

      expect(login.ok).toBeTruthy();
      expect(login.error).toBeNull();
      expect(login.session.token).toBeDefined();

      const newUserInput = {
        username: 'mohamed',
        firstName: 'sadok',
        lastName: 'khouaja',
        email: 'mohamed@email.com',
        password: '123456',
      };

      const { mutate: loggedMutate } = createApolloClient(login.session.token);

      const {
        data: { register },
      } = await loggedMutate({
        mutation: REGISTER,
        variables: {
          input: newUserInput,
        },
      });

      expect(register.ok).not.toBeTruthy();
      expect(register.session).toBeNull();
      expect(register.error).not.toBeNull();
      expect(register.error).toEqual('Already connected');
    });
  });

  describe('Login Mutations', () => {
    test('should return error if user does not exist', async () => {
      const credentials = {
        identifiant: 'unknown', // only sadok & sadok2 exist
        password: '123456',
      };
      const { mutate } = createApolloClient();

      const {
        data: { login },
      } = await mutate({
        mutation: LOGIN,
        variables: {
          input: credentials,
        },
      });

      expect(login.ok).not.toBeTruthy();
      expect(login.error).not.toBeNull();
      expect(login.error).toEqual('bad credentials');
      expect(login.session).toBeNull();
    });
    test('should return error if password is wrong', async () => {
      const credentials = {
        identifiant: 'sadok', // only sadok & sadok2 exist
        password: '********',
      };
      const { mutate } = createApolloClient();

      const {
        data: { login },
      } = await mutate({
        mutation: LOGIN,
        variables: {
          input: credentials,
        },
      });

      expect(login.ok).not.toBeTruthy();
      expect(login.error).not.toBeNull();
      expect(login.error).toEqual('bad credentials');
      expect(login.session).toBeNull();
    });
    test('should connect with email', async () => {
      const credentials = {
        identifiant: 'sadok@email.com', // only sadok & sadok2 exist
        password: '123456',
      };
      const { mutate } = createApolloClient();

      const {
        data: { login },
      } = await mutate({
        mutation: LOGIN,
        variables: {
          input: credentials,
        },
      });

      expect(login.ok).toBeTruthy();
      expect(login.error).toBeNull();
      expect(login.session.id).toBeDefined();
      expect(login.session.token).toBeDefined();
      expect(login.session.email).toEqual(credentials.identifiant);
    });
    test('should connect with username', async () => {
      const credentials = {
        identifiant: 'sadok', // only sadok & sadok2 exist
        password: '123456',
      };
      const { mutate } = createApolloClient();

      const {
        data: { login },
      } = await mutate({
        mutation: LOGIN,
        variables: {
          input: credentials,
        },
      });

      expect(login.ok).toBeTruthy();
      expect(login.error).toBeNull();
      expect(login.session.id).toBeDefined();
      expect(login.session.token).toBeDefined();
      expect(login.session.username).toEqual(credentials.identifiant);
    });
    test('should not access to login mutation if user was already connected', async () => {
      const credentials = {
        identifiant: 'sadok', // only sadok & sadok2 exist
        password: '123456',
      };
      const { mutate } = createApolloClient();

      const {
        data: { login },
      } = await mutate({
        mutation: LOGIN,
        variables: {
          input: credentials,
        },
      });

      expect(login.ok).toBeTruthy();
      expect(login.error).toBeNull();
      expect(login.session.token).toBeDefined();

      const { mutate: loggedMutate } = createApolloClient(login.session.token);

      const {
        data: { login: loginWithTokenExist },
      } = await loggedMutate({
        mutation: LOGIN,
        variables: {
          input: credentials,
        },
      });

      expect(loginWithTokenExist.ok).not.toBeTruthy();
      expect(loginWithTokenExist.session).toBeNull();
      expect(loginWithTokenExist.error).not.toBeNull();
      expect(loginWithTokenExist.error).toEqual('Already connected');
    });
  });
});
