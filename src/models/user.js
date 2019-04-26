import { Schema, model } from 'mongoose';
import auth from '../domains/auth';
import profile from '../domains/profile';

const UserSchema = new Schema(
  {
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
    followers: [String],
    bloqued: [String],
  },
  { timestamps: true },
);

UserSchema.methods.generateToken = function statefulGenerateToken(expire) {
  const { _id: id, email } = this;
  return auth.generateToken(id, email, expire);
};

UserSchema.methods.verifyPassword = function statefulVerifyPassword(passwordInput) {
  const { password } = this;
  return auth.verifyPassword(passwordInput, password);
};

UserSchema.statics.hashPassword = auth.hashPassword;
UserSchema.statics.decodeUser = auth.decodeUser;
UserSchema.statics.updateAvatar = function statefulUpdateAvatar(userId, avatar) {
  return profile.updateAvatar(this, userId, avatar);
};

export default model('User', UserSchema);
