import { gql } from 'apollo-server';
import { merge } from 'lodash';
import NewSessionResponse from './NewSessionResponse.type';

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
    register: async (_, { input: { password, ...otherFields } }, { models }) => {
      try {
        const hashedPassword = await models.User.hashPassword(password);
        const user = new models.User({ ...otherFields, password: hashedPassword });
        await user.save();
        const { _id: id, email, username } = user;
        const token = await user.generateToken();
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
    NewUserInput,
    registerMutation,
    ...NewSessionResponse.typeDefs,
  ],
  resolvers: merge(resolvers, NewSessionResponse.resolvers),
};
