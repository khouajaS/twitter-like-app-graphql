import { gql } from 'apollo-server';
import {
  buildSuccessMutationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

const UnBlockAcknowledgement = gql`
  type UnBlockAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const unblockMutation = gql`
  extend type Mutation {
    unblock(userId: ID!): UnBlockAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    unblock: tryCatchAsyncMutation(async (_, { userId }, { models, user }) => {
      const { nModified } = await models.User.update(
        { _id: user.id },
        { $pull: { blocked: userId } },
      );
      if (nModified === 0) {
        return buildFailedMutationResponse('you are already blocked him');
      }
      return buildSuccessMutationResponse();
    }),
  },
};

export default {
  typeDefs: [UnBlockAcknowledgement, unblockMutation],
  resolvers,
};
