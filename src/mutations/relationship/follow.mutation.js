import { gql } from 'apollo-server';
import {
  buildSuccessMutationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

const FollowAcknowledgement = gql`
  type FollowAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const followMutation = gql`
  extend type Mutation {
    follow(userId: ID!): FollowAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    follow: tryCatchAsyncMutation(async (_, { userId }, { models, user }) => {
      // TODO: transaction
      const { nModified } = await models.User.updateOne(
        { _id: user.id },
        { $addToSet: { following: userId } },
      );
      const { nModified: nModified2 } = await models.User.updateOne(
        { _id: userId },
        { $addToSet: { followers: user.id } },
      );

      if (nModified === 0 || nModified2 === 0) {
        return buildFailedMutationResponse('you are followed him before');
      }
      return buildSuccessMutationResponse();
    }),
  },
};

export default {
  typeDefs: [FollowAcknowledgement, followMutation],
  resolvers,
};
