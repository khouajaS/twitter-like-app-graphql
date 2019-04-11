import { gql } from 'apollo-server';
import { merge } from 'lodash';
import NewSessionResponse from './NewSessionResponse.type';

const LoginInput = gql`
  input LoginInput {
    identifiant: String!
    password: String!
  }
`;

const loginMutation = gql`
  extend type Mutation {
    login(input: LoginInput!): NewSessionResponse!
  }
`;

const resolvers = {
  Mutation: {
    login: async (_, { input: { identifiant, password } }, { models }) => {
      try {
        const currentUser = await models.User
          .findOne({ $or: [{ email: identifiant }, { username: identifiant }] });
        if (!currentUser) {
          return {
            ok: false,
            error: 'bad credentials',
          };
        }
        const correctPassword = await bcrypt.compare(password, currentUser.password);
        if (!correctPassword) {
          return {
            ok: false,
            error: 'bad credentials',
          };
        }
        const { _id: id, email, username } = currentUser;
        const token = await generateToken(id, email, SECRET_FOR_TOKEN);
        return {
          ok: true,
          session: {
            id,
            token,
            username,
            email,
          },
        };
      } catch (error) {
        return {
          ok: false,
          error: error.toString(),
        };
      }
    },
  },
};

export default {
  typeDefs: [
    LoginInput,
    loginMutation,
    ...NewSessionResponse.typeDefs,
  ],
  resolvers: merge(resolvers, NewSessionResponse.resolvers),
};
