import { gql } from 'apollo-server';
import {
  buildSuccessMuationResponse,
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
    follow(userId: ID!): FollowAcknowledgement!
  }
`;

const resolvers = {
  Mutation: {
    follow: tryCatchAsyncMutation(async (_, { userId }, { models, user }) => {
      // TODO: transaction
      const { nModified } = await models.User
        .update({ _id: user.id }, { $addToSet: { following: userId } });
      const { nModified: nModified2 } = await models.User
        .update({ _id: userId }, { $addToSet: { followers: user.id } });

      if (nModified === 0 || nModified2 === 0) {
        return buildFailedMutationResponse('you are followed him before');
      }
      return buildSuccessMuationResponse();
    }),
  },
};

export default {
  typeDefs: [
    FollowAcknowledgement,
    followMutation,
  ],
  resolvers,
};
