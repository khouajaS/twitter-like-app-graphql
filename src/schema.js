/* eslint-disable class-methods-use-this */
import { gql, SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server';
import { merge } from 'lodash';

import loginMutation from './mutations/auth/login.mutation';
import registerMutation from './mutations/auth/register.mutation';

import updateAvatarMutation from './mutations/profile/updateAvatar.mutation';

import blockMutation from './mutations/relationship/block.mutation';
import unblockMutation from './mutations/relationship/unblock.mutation';
import followMutation from './mutations/relationship/follow.mutation';
import unfollowMutation from './mutations/relationship/unfollow.mutation';

import likeTweetMutation from './mutations/timeline/likeTweet.mutation';
import unLikeTweetMutation from './mutations/timeline/unLikeTweet.mutation';
import newTweetMutation from './mutations/timeline/newTweet.mutation';
import removeTweetMutation from './mutations/timeline/removeTweet.mutation';
import replyToTweetMutation from './mutations/timeline/replyToTweet.mutation';
import retweetMutation from './mutations/timeline/retweet.mutation';

import meQuery from './queries/me.query';
import timelineQuery from './queries/timeLine.query';
import threadQuery from './queries/thread.query';
import tweetQuery from './queries/tweet.query';


const timeline = {
  typeDefs: [
    ...likeTweetMutation.typeDefs,
    ...unLikeTweetMutation.typeDefs,
    ...newTweetMutation.typeDefs,
    ...removeTweetMutation.typeDefs,
    ...replyToTweetMutation.typeDefs,
    ...retweetMutation.typeDefs,
  ],
  resolvers: merge(
    likeTweetMutation.resolvers,
    unLikeTweetMutation.resolvers,
    newTweetMutation.resolvers,
    removeTweetMutation.resolvers,
    replyToTweetMutation.resolvers,
    retweetMutation.resolvers,
  ),
};

const auth = {
  typeDefs: [
    ...loginMutation.typeDefs,
    ...registerMutation.typeDefs,
  ],
  resolvers: merge(
    loginMutation.resolvers,
    registerMutation.resolvers,
  ),
};

const profile = {
  typeDefs: [
    ...updateAvatarMutation.typeDefs,
  ],
  resolvers: updateAvatarMutation.resolvers,
};

const relationship = {
  typeDefs: [
    ...blockMutation.typeDefs,
    ...unblockMutation.typeDefs,
    ...followMutation.typeDefs,
    ...unfollowMutation.typeDefs,
  ],
  resolvers: merge(
    blockMutation.resolvers,
    unfollowMutation.resolvers,
    followMutation.resolvers,
    unfollowMutation.resolvers,
  ),
};

const queries = {
  typeDefs: [
    ...meQuery.typeDefs,
    ...timelineQuery.typeDefs,
    ...threadQuery.typeDefs,
    ...tweetQuery.typeDefs,
  ],
  resolvers: merge(
    meQuery.resolvers,
    timelineQuery.resolvers,
    threadQuery.resolvers,
    tweetQuery.resolvers,
  ),
};

const baseTypeDefs = gql`
  directive @private on FIELD_DEFINITION
  interface MutationResponse {
    error: String
    ok: Boolean
  }

  type Query {
    empty: String
  }

  type Mutation {
    empty2: String
  }
`;

const baseResolver = {
  Query: {
    empty: () => 'hello',
  },
  Mutation: {
    empty2: () => 'hello',
  },
};

const typeDefs = [
  baseTypeDefs,
  ...timeline.typeDefs,
  ...auth.typeDefs,
  ...profile.typeDefs,
  ...relationship.typeDefs,
  ...queries.typeDefs,
];

const resolvers = merge(
  baseResolver,
  timeline.resolvers,
  auth.resolvers,
  profile.resolvers,
  relationship.resolvers,
  queries.resolvers,
);

class privateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve } = field;
    // eslint-disable-next-line no-param-reassign
    field.resolve = async function newResolver(...args) {
      const [, , ctx] = args;
      if (!ctx.userid) {
        throw new AuthenticationError('You are not authorized to access this resource.');
      } else {
        const result = await resolve.apply(this, args);
        return result;
      }
    };
  }
}


const schemaDirectives = {
  private: privateDirective,
};

export { typeDefs };
export { resolvers };
export { schemaDirectives };
