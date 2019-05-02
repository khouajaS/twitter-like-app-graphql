import { gql } from 'apollo-server';
import {
  buildSuccessMutationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

const BlockAcknowledgement = gql`
  type BlockAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
`;

const blockMutation = gql`
  extend type Mutation {
    block(userId: ID!): BlockAcknowledgement! @private
  }
`;

const resolvers = {
  Mutation: {
    block: tryCatchAsyncMutation(async (_, { userId }, { models, user }) => {
      const { nModified } = await models.User.update(
        { _id: user.id },
        { $addToSet: { blocked: userId } },
      );
      if (nModified === 0) {
        return buildFailedMutationResponse('you are blocked him before');
      }
      return buildSuccessMutationResponse();
    }),
  },
};

export default {
  typeDefs: [BlockAcknowledgement, blockMutation],
  resolvers,
};
