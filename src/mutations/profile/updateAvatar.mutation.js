import { gql } from 'apollo-server';
import {
  buildSuccessMuationResponse,
  buildFailedMutationResponse,
  tryCatchAsyncMutation,
} from '../utils';

const AvatarUpdatedResponse = gql`
  type AvatarUpdatedResponse implements MutationResponse {
    error: String
    ok: Boolean
  }
`;

const AvatarInput = gql`
  input AvatarInput {
    big: String
    meduim: String
    small: String
  }
`;

const updateAvatarMutation = gql`
  extend type Mutation {
    updateAvatar(input: AvatarInput!): AvatarUpdatedResponse! @private
  }
`;

const resolvers = {
  Mutation: {
    updateAvatar: tryCatchAsyncMutation(
      async (_, { input }, { models, user }) => {
        const { error } = await models.User.updateAvatar(user.id, input);
        if (error) {
          return buildFailedMutationResponse(error);
        }
        return buildSuccessMuationResponse();
      },
    ),
  },
};

export default {
  typeDefs: [updateAvatarMutation, AvatarInput, AvatarUpdatedResponse],
  resolvers,
};
