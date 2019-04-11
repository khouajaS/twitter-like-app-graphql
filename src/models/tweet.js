import { Schema, model } from 'mongoose';

const TweetSchema = new Schema({
  content: String,
  isRetweet: { type: Boolean, default: false },
  tags: [String],
  likes: [String],
  parentId: String,
  owner: String,
}, { timestamps: true });

export default model('Tweet', TweetSchema);
