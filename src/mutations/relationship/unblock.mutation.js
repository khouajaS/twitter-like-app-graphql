import { gql } from 'apollo-server';

const UnBlockAcknowledgement = gql`
  type UnBlockAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const unblockMutation = gql`
  extend type Mutation {
    unblock(userId: ID!): UnBlockAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    unblock: async (_, { userId }, { models, user }) => {
      try {
        const { nModified } = await models.User
          .update({ _id: user.id }, { $pull: { bloqued: userId } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'you are already blocked him',
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
    UnBlockAcknowledgement,
    unblockMutation,
  ],
  resolvers,
};
