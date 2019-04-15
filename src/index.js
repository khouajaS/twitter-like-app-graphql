import mongoose from 'mongoose';
import dotEnv from 'dotenv';
import createApolloServer from './server';

dotEnv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/twitter';

mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
)
  .then(() => {
    createApolloServer().listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
