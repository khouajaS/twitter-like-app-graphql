import { gql } from 'apollo-server';
import { Task } from 'fawn';
import { buildSuccessMutationResponse, tryCatchAsyncMutation } from '../utils';

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
      await Task()
        .update(models.User, { _id: user.id }, { $addToSet: { following: userId } })
        .update(models.User, { _id: userId }, { $addToSet: { followers: user.id } })
        .run({ useMongoose: true });
      return buildSuccessMutationResponse();
    }),
  },
};

export default {
  typeDefs: [FollowAcknowledgement, followMutation],
  resolvers,
};
