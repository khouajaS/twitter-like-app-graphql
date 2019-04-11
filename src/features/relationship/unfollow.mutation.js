import { gql } from 'apollo-server';

const UnFollowAcknowledgement = gql`
  type UnFollowAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const unfollowMutation = gql`
  extend type Mutation {
    unfollow(userId: ID!): UnFollowAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    unfollow: async (_, { userId }, { models, user }) => {
      try {
        const { nModified } = await models.User
          .update({ _id: user.id }, { $pull: { following: userId } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'you are already unfollow him',
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
    UnFollowAcknowledgement,
    unfollowMutation,
  ],
  resolvers,
};
