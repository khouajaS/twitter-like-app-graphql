import { Schema, model } from 'mongoose';

/**
 * models: user => (username, firstName, lastName, avatar, following, bloqued)
 * tweets: tweet => (content, isRetweet, tags, likes, parentId)
 */

const TweetSchema = new Schema({
  content: String,
  isRetweet: { type: Boolean, default: false },
  tags: [String],
  likes: [String],
  parentId: String,
  owner: String,
}, { timestamps: true });

export default model('Tweet', TweetSchema);
