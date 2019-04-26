import { gql } from 'apollo-server';
import {
  buildSuccessMutationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

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
      // TODO: transaction
      const { nModified } = await models.User.update(
        { _id: user.id },
        { $pull: { following: userId } },
      );
      const { nModified: nModified2 } = await models.User.update(
        { _id: userId },
        { $pull: { followers: user.id } },
      );
      if (nModified === 0 || nModified2 === 0) {
        return buildFailedMutationResponse('you are already unfollow him');
      }
      return buildSuccessMutationResponse();
    }),
  },
};

export default {
  typeDefs: [UnFollowAcknowledgement, unfollowMutation],
  resolvers,
};
