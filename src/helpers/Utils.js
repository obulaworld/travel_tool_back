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

  static getResponseMessage(pagination, status, modelName) {
    let message;
    if (pagination.pageCount >= pagination.currentPage) {
      message = `${modelName}s retrieved successfully`;
    } else {
      message = pagination.currentPage === 1 && !status
        ? `You have no ${modelName.toLowerCase()}s at the moment`
        : `No ${modelName.toLowerCase()}s exists for this page`;
    }
    return message;
  }

  static getRequestStatusUpdateResponse(status) {
    return status === 'Approved'
      ? 'Request approved successfully' : 'Request rejected successfully';
  }

  static dateDiffInMonths(minDate, maxDate) {
    if (!minDate || !maxDate) return 0;
    const minimumDate = new Date(minDate);
    const maximumDate = new Date(maxDate);
    const yearDifference = (maximumDate.getFullYear() - minimumDate.getFullYear()) * 12;
    let monthDifference = (yearDifference - minimumDate.getMonth()) + 1;
    monthDifference += maximumDate.getMonth();
    return monthDifference;
  }
}

export default Utils;
