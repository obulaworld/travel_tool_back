import shortid from 'shortid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Utils {
  static generateUniqueId() {
    return shortid.generate();
  }

  static generateTestToken(payload) {
    const token = jwt.sign(
      payload,
      process.env.JWT_PUBLIC_KEY,
    );
    return token;
  }
}

export default Utils;
