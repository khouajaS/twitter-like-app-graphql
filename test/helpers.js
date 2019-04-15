import mongoose from 'mongoose';
import Tweet from '../src/models/tweet';
import User from '../src/models/user';
import { retry } from './utils';

const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb://localhost/twitter-test';

const beforeAll = async () => {
  const mongoUrl = MONGO_URI_TEST.replace('localhost', process.IPAddress);

  await retry(
    mongoose,
    mongoose.connect,
    [mongoUrl, { useNewUrlParser: true, useCreateIndex: true }],
  );

  await Tweet.deleteMany();
  await User.deleteMany();
};

const afterAll = async () => {
  await Tweet.deleteMany();
  await User.deleteMany();
  await mongoose.disconnect();
};

export default { beforeAll, afterAll };
