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

  static prependZeroToNumber(value) {
    return (value < 10) ? `0${value}` : value;
  }

  static getMonthFirstAndLastDate(monthNumber) {
    const currentDate = new Date();
    const firstDate = new Date(currentDate.getFullYear(), monthNumber, 1);
    const lastDate = new Date(currentDate.getFullYear(), monthNumber + 1, 0);
    const firstDateMonth = Utils.prependZeroToNumber(firstDate.getMonth() + 1);
    const lastDateMonth = Utils.prependZeroToNumber(lastDate.getMonth() + 1);
    const firstDateDay = Utils.prependZeroToNumber(firstDate.getDate());
    const firstDateString = `${firstDate.getFullYear()}-${firstDateMonth}-${firstDateDay}`;
    const lastDateString = `${lastDate.getFullYear()}-${lastDateMonth}-${lastDate.getDate()}`;
    return {
      firstDate: firstDateString,
      lastDate: lastDateString
    };
  }
}

export default Utils;
