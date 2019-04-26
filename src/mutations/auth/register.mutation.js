import { gql } from 'apollo-server';
import { merge } from 'lodash';
import NewSessionResponse from './NewSessionResponse.type';
import { buildSuccessMutationResponse, tryCatchAsyncMutation } from '../utils';

const NewUserInput = gql`
  input NewUserInput {
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
`;

const registerMutation = gql`
  extend type Mutation {
    register(input: NewUserInput!): NewSessionResponse!
  }
`;

const resolvers = {
  Mutation: {
    register: tryCatchAsyncMutation(
      async (_, { input: { password, ...otherFields } }, { models }) => {
        const hashedPassword = await models.User.hashPassword(password);
        const newUser = new models.User({
          ...otherFields,
          password: hashedPassword,
        });
        await newUser.save();
        const { _id: id, email, username } = newUser;
        const token = await newUser.generateToken();
        const session = {
          id,
          token,
          username,
          email,
        };
        return buildSuccessMutationResponse({ session });
      },
      { anonymous: true },
    ),
  },
};

export default {
  typeDefs: [NewUserInput, registerMutation, ...NewSessionResponse.typeDefs],
  resolvers: merge(resolvers, NewSessionResponse.resolvers),
};
