import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  username: { type: String, unique: true },
  firstName: String,
  lastName: String,
  avatar: {
    big: String,
    meduim: String,
    small: String,
  },
  following: [String],
  bloqued: [String],
}, { timestamps: true });

export default model('User', UserSchema);
