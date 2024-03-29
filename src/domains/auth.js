import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const getEnv = (env) => process.env[env] || '';

const SALT_ROUNDS = 10;
const defaultExpirationToken = Math.floor(Date.now() / 1000) + 60 * 60;

const generateToken = (id, email, expire) => {
  const exp = expire || defaultExpirationToken;
  const secret = getEnv('SECRET_FOR_TOKEN');
  return new Promise((resolve, reject) => {
    jwt.sign({ exp, email, id }, secret, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
};

const verifyPassword = (passwordInput, password) => bcrypt.compare(passwordInput, password);

const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
      if (error) {
        reject(error);
      } else {
        resolve(hash);
      }
    });
  });

const verifyToken = (token, secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });

const decodeUser = async (token) => {
  if (!token) return false;
  const secret = getEnv('SECRET_FOR_TOKEN');
  try {
    const user = await verifyToken(token, secret);
    return user;
  } catch (error) {
    return false;
  }
};

export default {
  decodeUser,
  hashPassword,
  verifyPassword,
  generateToken,
};
