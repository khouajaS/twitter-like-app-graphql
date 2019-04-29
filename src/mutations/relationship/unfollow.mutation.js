import { gql } from 'apollo-server';
import { Task } from 'fawn';
import { buildSuccessMutationResponse, tryCatchAsyncMutation } from '../utils';

const UnFollowAcknowledgement = gql`
  type UnFollowAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const unfollowMutation = gql`
  extend type Mutation {
    unfollow(userId: ID!): UnFollowAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    unfollow: tryCatchAsyncMutation(async (_, { userId }, { models, user }) => {
      await Task()
        .update(models.User, { _id: user.id }, { $pull: { following: userId } })
        .update(models.User, { _id: userId }, { $pull: { followers: user.id } })
        .run({ useMongoose: true });
      return buildSuccessMutationResponse();
    }),
  },
};

export default {
  typeDefs: [UnFollowAcknowledgement, unfollowMutation],
  resolvers,
};
