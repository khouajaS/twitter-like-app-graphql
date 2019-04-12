import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import dotEnv from 'dotenv';
import jwt from 'jsonwebtoken';
import { get } from 'lodash';
import User from './models/user';
import Tweet from './models/tweet';
import { typeDefs, resolvers, schemaDirectives } from './schema';

dotEnv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/twitter';
const SECRET_FOR_TOKEN = process.env.SECRET_FOR_TOKEN || '';


const verifyToken = (token, secret) => new Promise((resolve, reject) => {
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
    const user = await verifyToken(token, SECRET_FOR_TOKEN);
    return user;
  } catch (error) {
    return false;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
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
