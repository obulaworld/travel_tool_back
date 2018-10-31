import _ from 'lodash';
import moment from 'moment';
import { Parser } from 'json2csv';
import models from '../../../database/models';
import Error from '../../../helpers/Error';
import TravelChecklistHelper from '../../../helpers/travelChecklist';

const { Op } = models.Sequelize;
const andelaCenters = TravelChecklistHelper.getAndelaCenters();
class AnalyticsController {
  static getCount(value) {
    const result = value.reduce((i, j) => Object.assign(i, { [j]: (i[j] || 0) + 1 }), {});
    return result;
  }

  static getResult(count) {
    const results = [];
    Object.keys(count).forEach((key) => {
      results.push({ name: key, value: count[key] });
    });
    return results;
  }

  static async getRequestFromDb(query, res) {
    try {
      const requests = await models.Request.findAndCountAll({ ...query });
      return JSON.stringify(requests);
    } catch (error) {
      Error.handleError(error.toString(), 500, res);
    }
  }

  static leadTime(allTrips) {
    const alltripDetails = allTrips.map(trip => trip.dataValues.trips);
    const requestDates = allTrips.map(trip => moment(trip.dataValues.createdAt).format('YYYY-MM-DD'));
    const departDates = alltripDetails.map(trip => trip.map(departure => departure.dataValues.departureDate));
    const minDepart = departDates.map(dep => _.max(dep));
    const convertLeadTimeToString = minDepart.map((x, i) => {
      const leadTimeToString = new Date(x) - new Date(requestDates[i]);
      const leadTimeResult = leadTimeToString / (1000 * 3600 * 24) + 1;
      const leadTimeDuration = `${leadTimeResult.toString()} days`;
      return leadTimeDuration;
    });
    const getCountOfLeadDuration = AnalyticsController.getCount(convertLeadTimeToString);
    const leadTimeduration = AnalyticsController.getResult(getCountOfLeadDuration);
    return leadTimeduration;
  }

  static isLocationInTrips(trips, key, location) {
    const found = trips.find(trip => trip[`${key}`] === (andelaCenters[location] || location));
    const isFound = !!found;
    return isFound;
  }

  static async getPeopleRequests(location, dateQuery, res) {
    const where = { [Op.or]: { destination: (andelaCenters[location] || location), origin: (andelaCenters[location] || location) }, departureDate: dateQuery };
    const query = {
      include: [{ model: models.Trip, as: 'trips', where }]
    };
    let peopleRequests = await AnalyticsController.getRequestFromDb(query, res);
    peopleRequests = JSON.parse(peopleRequests);
    const peopleLeaving = peopleRequests.rows.filter(request => this.isLocationInTrips(request.trips, 'origin', location));
    const peopleVisiting = peopleRequests.rows.filter(request => this.isLocationInTrips(request.trips, 'destination', location));
    return { allRequests: peopleRequests, peopleLeaving, peopleVisiting };
  }

  static async getRequestsDuration(dateQuery, location) {
    const query = {
      include: [
        {
          model: models.Trip,
          required: true,
          as: 'trips',
          where: { origin: (andelaCenters[location] || location), departureDate: dateQuery }
        }
      ],
      where: { tripType: { [Op.ne]: 'oneWay' } }
    };
    let requestsWithReturnDate = await AnalyticsController.getRequestFromDb(query);
    requestsWithReturnDate = JSON.parse(requestsWithReturnDate);
    const durations = requestsWithReturnDate.rows.map((request) => {
      const depatureDates = request.trips.map(trip => new Date(trip.departureDate));
      const returnDates = request.trips.map(trip => new Date(trip.returnDate));
      const minDeparture = _.min(depatureDates);
      const maxReturn = _.max(returnDates);
      const durationToDay = (maxReturn - minDeparture) / (1000 * 3600 * 24) + 1; // eslint-disable-line
      const day = `${durationToDay.toString()} days`;
      return day;
    });
    const getCountOfDuration = AnalyticsController.getCount(durations);
    const durationsResult = AnalyticsController.getResult(getCountOfDuration);
    return { durationsResult, requestsWithReturnDate };
  }

  static async analytics(req, res) {
    try {
      const { location } = req.user;
      const { dateFrom, dateTo } = req.query;
      const dateQuery = {};
      if (!dateFrom && !dateTo) dateQuery[Op.ne] = null;
      if (dateFrom) dateQuery[Op.gte] = dateFrom;
      if (dateTo) dateQuery[Op.lte] = dateTo;
      const pendingRequestsQuery = { include: [{ model: models.Trip, as: 'trips', where: { origin: (andelaCenters[location] || location), departureDate: dateQuery } }], where: { status: 'Open' }
      };
      let pendingRequests = await AnalyticsController.getRequestFromDb(pendingRequestsQuery, res);
      pendingRequests = JSON.parse(pendingRequests);
      const peopleRequests = await AnalyticsController.getPeopleRequests(location, dateQuery, res);
      const { durationsResult, requestsWithReturnDate } = await AnalyticsController.getRequestsDuration(dateQuery, location);
      const allTrips = await models.Request.findAll({
        include: [
          { model: models.Trip, required: true, as: 'trips', where: { [Op.and]: [{ departureDate: { [Op.ne]: null } }, { origin: andelaCenters[location] || location }, { departureDate: dateQuery }] }
}]
      });
      const leadTripDetails = AnalyticsController.leadTime(allTrips);
      const response = {
        total_requests: peopleRequests.allRequests.count,
        pending_requests: pendingRequests.count,
        people_visiting: peopleRequests.peopleVisiting.length,
        people_leaving: peopleRequests.peopleLeaving.length,
        travel_duration_breakdown: { durations: durationsResult, total: requestsWithReturnDate.count },
        travel_lead_time_breakdown: { lead_times: leadTripDetails, total: allTrips.length }
      };
      if (req.query.type === 'file') {
        const fields = ['total_requests', 'pending_requests', 'people_visiting', 'people_leaving', 'travel_duration_breakdown.durations', 'travel_lead_time_breakdown.lead_times'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(response);
        return res.attachment('Travel Analysis Report.csv').send(csv);
      } return res.status(200).json({ success: true, data: response });
    } catch (error) { /* istanbul ignore next */
      return Error.handleError(error.toString(), 500, res);
    }
  }
}

export default AnalyticsController;
