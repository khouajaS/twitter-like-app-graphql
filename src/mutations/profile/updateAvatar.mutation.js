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
    updateAvatar: tryCatchAsyncMutation(async (_, { input }, { models, user }) => {
      const { nModified } = await models
        .User.update({ _id: user.id }, { $set: { avatar: input } });
      if (nModified === 0) {
        return buildFailedMutationResponse('user does not exist');
      }
      return buildSuccessMuationResponse();
    }),
  },
};

export default {
  typeDefs: [
    updateAvatarMutation,
    AvatarInput,
    AvatarUpdatedResponse,
  ],
  resolvers,
};
