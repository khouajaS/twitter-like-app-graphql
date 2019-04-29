import mongoose from 'mongoose';
import dotEnv from 'dotenv';
import Fawn from 'fawn';
import createApolloServer from './server';

dotEnv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/twitter';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    Fawn.init(mongoose);
    createApolloServer()
      .listen()
      .then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`); // eslint-disable-line no-console
      });
  })
  .catch((error) => {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
