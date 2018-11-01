import Json2csv from 'json2csv';
import models from '../../../database/models';
import CustomError from '../../../helpers/Error';
import TravelCompletion from '../../travelChecklist/TravelChecklistController';
import Pagination from '../../../helpers/Pagination';
import TravelChecklistHelper from '../../../helpers/travelChecklist';

class ReadinessController {
  static calculateArrivalAndPercentageCompletion(result, req, res) {
    if (!result.rows.length) return [];
    const departure = (result.rows[0].dataValues.departureDate);
    const departureDate = new Date(departure);
    const calculateArrival = departureDate.setDate(departureDate.getDate() + 1);
    const arrivalDate = new Date(calculateArrival);

    const travelReady = Promise.all(result.rows.map(async (request) => {
      const travelReadiness = await TravelCompletion.checkListPercentage(
        req, res, request.request.id
      );
      request.dataValues.travelReadiness = travelReadiness;
      request.dataValues.arrivalDate = arrivalDate;

      return request;
    }));

    return travelReady;
  }

  static async getReadiness(req, res) {
    const { page, limit } = req.query;

    try {
      const currentUserId = req.user.UserInfo.id;
      const location = await models.User.findOne({
        attributes: ['location'],
        where: { userId: currentUserId },
        raw: true
      });
      const andelaCenters = TravelChecklistHelper.getAndelaCenters();
      const offset = (page - 1) * limit;
      const filterByLocation = Object.values(location).toString();
      const result = await models.Trip.findAndCountAll({
        limit,
        offset,
        where: { destination: andelaCenters[`${filterByLocation}`] },
        attributes: ['departureDate'],
        include: [{
          model: models.Request,
          attributes: ['name'],
          where: { status: 'Approved' },
          as: 'request',
        }],
      });
      const pagination = Pagination.getPaginationData(
        req.query.page, req.query.limit, result.count
      );

      const travelReady = this.calculateArrivalAndPercentageCompletion(result, req, res);

      const readiness = await travelReady;
      return ({
        readiness,
        pagination
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError('Server Error', 500, res);
    }
  }

  static async getReadinessCsv(req, res) {
    const { type } = req.query;
    const { readiness, pagination } = await ReadinessController.getReadiness(req, res);
    if (type === 'file') {
      const csvArray = [];
      readiness.forEach((value) => {
        csvArray.push({
          DepartureDate: value.departureDate,
          Name: value.request.name,
          Complete: value.dataValues.travelReadiness,
          arrivalDate: value.dataValues.arrivalDate
        });
      });
      const Json2csvParser = Json2csv.Parser;
      const fields = ['DepartureDate', 'Name', 'Complete', 'arrivalDate'];
      const convertToCsv = new Json2csvParser({ fields });
      const csv = convertToCsv.parse(csvArray);
      return res.attachment('Travel readiness for all travelers').send(csv);
    }
    return res.status(200).json({ readiness, pagination, success: true });
  }
}
export default ReadinessController;
