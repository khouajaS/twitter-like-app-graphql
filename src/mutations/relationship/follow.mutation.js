import { gql } from 'apollo-server';

const FollowAcknowledgement = gql`
  type FollowAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const followMutation = gql`
  extend type Mutation {
    follow(userId: ID!): FollowAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    follow: async (_, { userId }, { models, user }) => {
      try {
        // TODO: transaction
        const { nModified } = await models.User
          .update({ _id: user.id }, { $addToSet: { following: userId } });
        const { nModified: nModified2 } = await models.User
          .update({ _id: userId }, { $addToSet: { followers: user.id } });

        if (nModified === 0 || nModified2 === 0) {
          return {
            ok: false,
            error: 'you are followed him before',
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
    FollowAcknowledgement,
    followMutation,
  ],
  resolvers,
};
