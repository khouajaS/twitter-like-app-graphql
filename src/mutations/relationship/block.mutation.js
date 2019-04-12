import { gql } from 'apollo-server';

const BlockAcknowledgement = gql`
  type BlockAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const blockMutation = gql`
  extend type Mutation {
    block(userId: ID!): BlockAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    block: async (_, { userId }, { models, user }) => {
      try {
        const { nModified } = await models.User
          .update({ _id: user.id }, { $addToSet: { bloqued: userId } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'you are blocked him before',
          };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
  },
};

export default {
  typeDefs: [
    BlockAcknowledgement,
    blockMutation,
  ],
  resolvers,
};
