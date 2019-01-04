import { Parser } from 'json2csv';
import _ from 'lodash';

import models from '../../../database/models';
import Error from '../../../helpers/Error';
import Pagination from '../../../helpers/Pagination';
import fields from './fields';
import Utils from './utils';
import TravelCalendarError from '../../../exceptions/travelCalendarExceptions';
import Centers from '../../../helpers/centers';
import { srcRequestWhereClause } from '../../../helpers/requests';

const { Op } = models.Sequelize;

class CalendarController {
  static async queryDB(query) {
    const data = await models.Request.findAndCountAll({ ...query });
    return data;
  }

  static dateQuery(dateFrom, dateTo) {
    const dateQuery = {};
    if (!dateFrom && !dateTo) dateQuery[Op.ne] = null;
    if (dateFrom && dateTo) {
      dateQuery[Op.or] = {
        [Op.or]: [dateFrom, dateTo], [Op.between]: [dateFrom, dateTo]
      };
    }
    return dateQuery;
  }


  static async getRequestDetails(center, dateFrom, dateTo) {
    const dateQuery = await CalendarController.dateQuery(dateFrom, dateTo);
    const query = {
      raw: true,
      where: srcRequestWhereClause,
      attributes: ['id', 'name', 'department', 'role', 'picture', 'tripType'],
      order: [['id', 'ASC']],
      include: [{
        model: models.Trip,
        as: 'trips',
        attributes: ['origin', 'destination', 'departureDate', 'returnDate'],
        where: {
          [Op.and]: [
            { [Op.or]: [{ origin: center }, { destination: center }] },
            { [Op.or]: [{ departureDate: dateQuery }, { returnDate: dateQuery }] },
          ]
        },
        include: [{
          model: models.ChecklistSubmission,
          as: 'submissions',
          where: { checklistItemId: '1' },
          attributes: ['value']
        }],
      }]
    };
    const requestDetails = await CalendarController.queryDB(query, 'request');
    return requestDetails;
  }

  static getTravelDetails(location, requestDetails) {
    if (requestDetails.length > 0) {
      const multiTrips = _.remove(requestDetails, request => (request.tripType === 'multi'));
      const multiTripsData = Utils.handleMultiTrips(location, multiTrips);
      const flightDetails = requestDetails.map((details) => {
        const {
          name, department, role, picture, tripType
        } = details;
        const ticket = JSON.parse(details['trips.submissions.value']);
        const flight = Utils.handleDestinations(location, tripType, details['trips.origin'],
          details['trips.destination'], ticket);
        return {
          name, department, role, picture, flight
        };
      });
      return _.concat(flightDetails, multiTripsData);
    }
    throw new TravelCalendarError('No records found', 404);
  }

  static async convertTocsvFile(res, response, type) {
    if (type === 'file') {
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(response.data);
      return res.status(200).attachment('Travel Calendar Analytics.csv').send(csv);
    }
    return res.status(200).json(response);
  }

  static async getTravelCalendarAnalytics(req, res) {
    const {
      type, location, dateFrom, dateTo, page
    } = req.query;
    let { limit } = req.query;
    limit = limit || 3;

    const center = await Centers.getCenter(location);
    try {
      const requestDetails = await CalendarController.getRequestDetails(center, dateFrom, dateTo);
      const allData = CalendarController.getTravelDetails(center, requestDetails.rows);
      const pagination = Pagination.getPaginationData(page, limit, allData.length);
      pagination.limit = limit;
      pagination.nextPage = pagination.currentPage + 1;
      pagination.prevPage = pagination.currentPage - 1;
      const data = Utils.handlePagination(allData, limit, page);

      if (data.length) {
        const response = { data, pagination };
        await CalendarController.convertTocsvFile(res, response, type);
      } else {
        throw new TravelCalendarError('No records found', 404);
      }
    } catch (error) {
      if (error instanceof TravelCalendarError) {
        return Error.handleError(error.message, error.status, res);
      }
      /* istanbul ignore next */
      return Error.handleError(error, 500, res);
    }
  }
}

export default CalendarController;
