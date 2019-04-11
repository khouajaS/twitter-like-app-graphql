import { merge } from 'lodash';

import loginMutation from './features/auth/login.mutation';
import registerMutation from './features/auth/register.mutaion';

import updateAvatarMutation from './features/profile/updateAvatar.mutation';

import blockMutation from './features/relationship/block.mutation';
import unblockMutation from './features/relationship/unblock.mutation';
import followMutation from './features/relationship/follow.mutation';
import unfollowMutation from './features/relationship/unfollow.mutation';

import likeTweetMutation from './features/timeline/likeTweet.mutation';
import unLikeTweetMutation from './features/timeline/unLikeTweet.mutation';
import newTweetMutation from './features/timeline/newTweet.mutation';
import removeTweetMutation from './features/timeline/removeTweet.mutation';
import replyToTweetMutation from './features/timeline/replyToTweet.mutation';
import retweetMutation from './features/timeline/retweet.mutation';


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

const baseTypeDefs = gql`
  interface Node {
    id: ID!
  }
  type Query {
    node(id: ID): Node
  }
`;

const baseResolver = {
  Query: {
    node: (_, args, ctx) => categoriesServices.node(args, ctx),
  },
};

const typeDefs = [
  baseTypeDefs,
  ...catalog.typeDefs,
  ...orders.typeDefs,
];
const resolvers = merge(
  baseResolver,
  catalog.resolvers,
  orders.resolvers,
);

export default { typeDefs, resolvers };
