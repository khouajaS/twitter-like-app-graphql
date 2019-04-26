import { gql } from 'apollo-server';
import { merge } from 'lodash';
import NewSessionResponse from './NewSessionResponse.type';
import {
  buildSuccessMutationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

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
    login: tryCatchAsyncMutation(
      async (_, { input: { identifiant, password } }, { models }) => {
        const currentUser = await models.User.findOne({
          $or: [{ email: identifiant }, { username: identifiant }],
        });
        if (!currentUser) {
          return buildFailedMutationResponse('bad credentials');
        }

        const correctPassword = await currentUser.verifyPassword(password);
        if (!correctPassword) {
          return buildFailedMutationResponse('bad credentials');
        }

        const { _id: id, email, username } = currentUser;
        return buildSuccessMutationResponse({
          session: {
            token: await currentUser.generateToken(),
            id,
            username,
            email,
          },
        });
      },
      { anonymous: true },
    ),
  },
};

export default {
  typeDefs: [LoginInput, loginMutation, ...NewSessionResponse.typeDefs],
  resolvers: merge(resolvers, NewSessionResponse.resolvers),
};
