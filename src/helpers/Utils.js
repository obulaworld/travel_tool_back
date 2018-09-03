import shortid from 'shortid';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

class Utils {
  static generateUniqueId() {
    return shortid.generate();
  }

  static generateTestToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_PUBLIC_KEY);
    return token;
  }

  static getRequestResponseMessage(pagination, status) {
    let message;
    if (pagination.pageCount >= pagination.currentPage) {
      message = 'Requests retrieved successfully';
    } else {
      message = pagination.currentPage === 1 && !status
        ? 'You have no requests at the moment' : 'No data exists for this page';
    }
    return message;
  }
}

export default Utils;
