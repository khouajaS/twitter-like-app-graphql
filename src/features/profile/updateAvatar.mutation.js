import { gql } from 'apollo-server';

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
    updateAvatar(input: AvatarInput!): AvatarUpdatedResponse!
  }
`;

const resolvers = {
  Mutation: {
    updateAvatar: async (_, { input }, { models, user }) => {
      try {
        const { nModified } = await models
          .User.update({ _id: user.id }, { $set: { avatar: input } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'user does not exist',
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
    updateAvatarMutation,
    AvatarInput,
    AvatarUpdatedResponse,
  ],
  resolvers,
};
