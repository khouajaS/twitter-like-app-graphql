import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET_FOR_TOKEN = process.env.SECRET_FOR_TOKEN || '';
const SALT_ROUNDS = 10;
const defaultExpirationToken = Math.floor(Date.now() / 1000) + (60 * 60);

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
  followers: [String],
  bloqued: [String],
}, { timestamps: true });

UserSchema.methods.generateToken = function generateToken(exp = defaultExpirationToken) {
  const { _id: id, email } = this;
  return new Promise(
    (resolve, reject) => {
      jwt.sign({ exp, email, id }, SECRET_FOR_TOKEN, (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    },
  );
};

UserSchema.methods.verifyPassword = function verifyPassword(passwordInput) {
  const { password } = this;
  return bcrypt.compare(passwordInput, password);
};

UserSchema.statics.hashPassword = function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
      if (error) {
        reject(error);
      } else {
        resolve(hash);
      }
    });
  });
};

export default model('User', UserSchema);
