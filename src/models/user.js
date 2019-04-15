import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const getEnv = env => process.env[env] || '';

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
  const secret = getEnv('SECRET_FOR_TOKEN');
  const { _id: id, email } = this;
  return new Promise(
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

const verifyToken = (token, secret) => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      reject(error);
    } else {
      resolve(decoded);
    }
  });
});

UserSchema.statics.decodeUser = async function decodeUser(token) {
  if (!token) return false;
  const secret = getEnv('SECRET_FOR_TOKEN');
  try {
    const user = await verifyToken(token, secret);
    return user;
  } catch (error) {
    return false;
  }
};

export default model('User', UserSchema);
