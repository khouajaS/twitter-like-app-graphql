import { ApolloServer, gql } from 'apollo-server';
import mongoose from 'mongoose';
import dotEnv from 'dotenv';
import jwt from 'jsonwebtoken';
import { get } from 'lodash';
import bcrypt from 'bcrypt';
import User from './models/user';
import Tweet from './models/tweet';

dotEnv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/twitter';
const SECRET_FOR_TOKEN = process.env.SECRET_FOR_TOKEN || '';

const typeDefs = gql`
  type ListUser {
    count: Int!
    list: [User]!
  }
  type Picture {
    url: String!
  }

  type Avatar {
    big: Picture!
    meduim: Picture!
    small: Picture!
  }

  type Likes {
    count: Int
    list: [User]
  }

  type Retweets {
    count: Int
    list: [Tweet]
  }

  type Tweet {
    content: String
    isRetweet: Boolean
    owner: User
    tags: [User]
    likes: Likes
    retweets: Retweets
    replies: [Thread]
    createdAt: String
  }

  type Thread {
    tweet: Tweet
    replies: [Thread]
  }

  type TimeLine {
    threads: [Thread]
  }

  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    fullName: String!
    email: String!
    avatar: Avatar!
    timeLine: TimeLine!
    tweets: [Tweet]
    following: ListUser!
    followers: ListUser!
    bloqued: ListUser!
  }

  type Query {
    me: User
    timeLine: TimeLine
    # profile: Profile
    thread: Thread
    tweet: Tweet
  }

  type Session {
    id: ID
    token: String
    username: String
    email: String
  }

  input NewUserInput {
    username: String
    firstName: String
    lastName: String
    email: String
    password: String
  }

  input LoginInput {
    identifiant: String
    password: String
  }

  interface MutationResponse {
    error: String
    ok: Boolean
  }


  type NewSessionResponse implements MutationResponse {
    error: String
    ok: Boolean
    session: Session
  }

  type AvatarUpdatedResponse implements MutationResponse {
    error: String
    ok: Boolean
  }

  input AvatarInput {
    big: String
    meduim: String
    small: String
  }

  input TweetInput {
    content: String
    tags: [String]
  }

  type TweetAddedAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
    tweet: Tweet
  }

  type TweetLikedAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
  }

  type TweetUnLikedAcknowledgement implements MutationResponse {
    error: String
    ok: Boolean
  }

  type RetweetAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }

  type ReplyToTweetAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
    tweet: Tweet
  }

  type removeTweetAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }

  type FollowAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
  type UnFollowAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
  type BlockAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }
  type UnBlockAcknowledgement implements MutationResponse {
    ok: Boolean
    error: String
  }

  type Mutation {
    # Auth
    register(input: NewUserInput!): NewSessionResponse!
    login(input: LoginInput!): NewSessionResponse!
    # # Profile
    updateAvatar(input: AvatarInput!): AvatarUpdatedResponse!
    # # TimeLine
    newTweet(input: TweetInput!): TweetAddedAcknowledgement!
    removeTweet(tweetId: ID!): removeTweetAcknowledgement!
    likeTweet(tweetId: ID!): TweetLikedAcknowledgement!
    unLikeTweet(tweetId: ID!): TweetUnLikedAcknowledgement!
    retweet(tweetId: ID!): RetweetAcknowledgement!
    replyToTweet(tweetId: ID!, tweet: TweetInput!): ReplyToTweetAcknowledgement!
    # # relationship
    follow(userId: ID!): FollowAcknowledgement!
    unfollow(userId: ID!): UnFollowAcknowledgement!
    block(userId: ID!): BlockAcknowledgement!
    unblock(userId: ID!): UnBlockAcknowledgement!
  }
`;

const verifyToker = (token, secret) => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      reject(error);
    } else {
      resolve(decoded);
    }
  });
});

const decodeUser = async (req) => {
  const token = get(req, ['headers', 'x-auth']);
  if (!token) return false;
  try {
    const user = await verifyToker(token, SECRET_FOR_TOKEN);
    return user;
  } catch (error) {
    return false;
  }
};

const hashPassword = (password, saltRounds) => new Promise((resolve, reject) => {
  bcrypt.hash(password, saltRounds, (error, hash) => {
    if (error) {
      reject(error);
    } else {
      resolve(hash);
    }
  });
});

const defaultExpirationToken = Math.floor(Date.now() / 1000) + (60 * 60);

const generateToken = (id, email, secret, exp = defaultExpirationToken) => new Promise(
  (resolve, reject) => {
    jwt.sign({ exp, email, id }, secret, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  },
);


const resolvers = {
  Mutation: {
    register: async (_, { input: { password, ...otherFields } }, { models }) => {
      try {
        const hashedPassword = await hashPassword(password, 10);
        const user = new models.User({ ...otherFields, password: hashedPassword });
        await user.save();
        const { _id: id, email, username } = user;
        const token = await generateToken(id, email, SECRET_FOR_TOKEN);
        return {
          ok: true,
          session: {
            id,
            token,
            username,
            email,
          },
        };
      } catch (error) {
        return {
          ok: false,
          error: error.toString(),
        };
      }
    },
    login: async (_, { input: { identifiant, password } }, { models }) => {
      try {
        const currentUser = await models.User
          .findOne({ $or: [{ email: identifiant }, { username: identifiant }] });
        if (!currentUser) {
          return {
            ok: false,
            error: 'bad credentials',
          };
        }
        const correctPassword = await bcrypt.compare(password, currentUser.password);
        if (!correctPassword) {
          return {
            ok: false,
            error: 'bad credentials',
          };
        }
        const { _id: id, email, username } = currentUser;
        const token = await generateToken(id, email, SECRET_FOR_TOKEN);
        return {
          ok: true,
          session: {
            id,
            token,
            username,
            email,
          },
        };
      } catch (error) {
        return {
          ok: false,
          error: error.toString(),
        };
      }
    },
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
    newTweet: async (_, { input: { content, tags } }, { models, user }) => {
      try {
        const tweet = new models.Tweet({ content, tags, owner: user.id });
        await tweet.save();
        return { ok: true, tweet };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
    likeTweet: async (_, { tweetId }, { models, user }) => {
      try {
        const { nModified } = await models.Tweet
          .update({ _id: tweetId }, { $addToSet: { likes: user.id } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'tweet does not exist or liked before',
          };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
    unLikeTweet: async (_, { tweetId }, { models, user }) => {
      try {
        const { nModified } = await models.Tweet
          .update({ _id: tweetId }, { $pull: { likes: user.id } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'tweet does not exist or not liked before',
          };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
    retweet: async (_, { tweetId }, { models, user }) => {
      try {
        const currentTweet = await models.Tweet.findOne({ _id: tweetId });
        if (!currentTweet) {
          return {
            ok: false,
            error: 'tweet does not exist',
          };
        }

        const retweet = new models.Tweet({ isRetweet: true, parentId: tweetId, owner: user.id });
        await retweet.save();
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
    replyToTweet: async (_, { tweetId, TweetInput: { content, tags } }, { models, user }) => {
      try {
        const tweet = new models.Tweet({
          content,
          tags,
          owner: user.id,
          parentId: tweetId,
        });
        await tweet.save();
        return {
          ok: true,
          tweet,
        };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
    removeTweet: async (_, { tweetId }, { models, user }) => {
      try {
        const { nRemoved } = await models.Tweet.remove({ _id: tweetId, owner: user.id });
        if (nRemoved === 0) {
          return {
            ok: false,
            error: 'tweet does not exist or not yours!',
          };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
    follow: async (_, { userId }, { models, user }) => {
      try {
        const { nModified } = await models.User
          .update({ _id: user.id }, { $addToSet: { following: userId } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'you are followed him before',
          };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
    unfollow: async (_, { userId }, { models, user }) => {
      try {
        const { nModified } = await models.User
          .update({ _id: user.id }, { $pull: { following: userId } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'you are already unfollow him',
          };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
    block: async (_, { userId }, { models, user }) => {
      try {
        const { nModified } = await models.User
          .update({ _id: user.id }, { $addToSet: { bloqued: userId } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'you are blocked him before',
          };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
    unblock: async (_, { userId }, { models, user }) => {
      try {
        const { nModified } = await models.User
          .update({ _id: user.id }, { $pull: { bloqued: userId } });
        if (nModified === 0) {
          return {
            ok: false,
            error: 'you are already blocked him',
          };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.toString() };
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mockEntireSchema: false,
  mocks: true,
  context: async ({ req }) => {
    const user = await decodeUser(req);
    return {
      user,
      models: { User, Tweet },
    };
  },
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
