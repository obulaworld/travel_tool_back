import Json2csv from 'json2csv';
import moment from 'moment';
import models from '../../../database/models';
import CustomError from '../../../helpers/Error';
import TravelCompletion from '../../travelChecklist/TravelChecklistController';
import Pagination from '../../../helpers/Pagination';
import Centers from '../../../helpers/centers';

class ReadinessController {
  static calcArrivalAndPercentageCompletion(result, req, res) {
    if (!result.rows.length) return [];
    const travelReady = Promise.all(result.rows.map(async (request) => {
      const travelReadiness = await TravelCompletion.checkListPercentage(
        req, res, request.request.id
      );

      request.dataValues.travelReadiness = travelReadiness;
      request.dataValues.arrivalDate = moment(request.dataValues.departureDate)
        .add(1, 'day');

      return request;
    }));

    return travelReady;
  }

  static handlePagination(req, result) {
    const pagination = Pagination.getPaginationData(
      req.query.page, req.query.limit, result.count
    );
    pagination.limit = req.query.limit;
    pagination.nextPage = pagination.currentPage + 1;
    pagination.prevPage = pagination.currentPage - 1;

    return pagination;
  }

  static async getReadiness(req, res) {
    const { page, limit, travelFlow = 'inflow' } = req.query;
    try {
      const currentUserId = req.user.UserInfo.id;
      const location = await models.User.findOne({
        attributes: ['location'],
        where: { userId: currentUserId },
        raw: true
      });

      const andelaCenter = await Centers.getCenter(Object.values(location).toString());

      const offset = (page - 1) * limit;
      const result = await models.Trip.findAndCountAll({
        limit: limit || null,
        offset: offset || null,
        where: travelFlow === 'inflow' ? { destination: andelaCenter }
          : { origin: andelaCenter },
        attributes: ['departureDate'],
        include: [{
          model: models.Request,
          attributes: ['name', 'id'],
          where: { status: 'Approved' },
          as: 'request',
        }],
        order: [[{ model: models.Request, as: 'request' }, 'updatedAt', 'DESC']],
      });
      const pagination = ReadinessController.handlePagination(req, result);

      const travelReady = this.calcArrivalAndPercentageCompletion(result, req, res);

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
    const { type, travelFlow } = req.query;
    const { readiness, pagination } = await ReadinessController.getReadiness(req, res);
    if (type === 'file') {
      const csvArray = [];
  
      const dateValue = (travelFlow === 'inflow')
        ? 'Expected Arrival Date' : 'Expected Departure Date';

      readiness.forEach((value) => {
        csvArray.push({
          Name: value.request.name,
          'Travel Readiness': value.dataValues.travelReadiness,
          [dateValue]: moment(value.dataValues.departureDate).format('D MMM, YYYY')
        });
      });
      
      const Json2csvParser = Json2csv.Parser;
      const fields = travelFlow === 'inflow'
        ? ['Name', 'Travel Readiness', 'Expected Arrival Date']
        : ['Name', 'Travel Readiness', 'Expected Departure Date'];
      const convertToCsv = new Json2csvParser({ fields });
      const csv = convertToCsv.parse(csvArray);
      return res.attachment('Travel readiness for all travelers').send(csv);
    }
    return res.status(200).json({ readiness, pagination, success: true });
  }
}
export default ReadinessController;
