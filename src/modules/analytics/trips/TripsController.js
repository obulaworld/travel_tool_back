import { Parser } from 'json2csv';
import models from '../../../database/models';
import Error from '../../../helpers/Error';
import Utils from '../../../helpers/Utils';
import TravelChecklistHelper from '../../../helpers/travelChecklist';

const { Op } = models.Sequelize;
class TripsController {
  static generateAnalysis(trips) {
    const report = [];
    trips.forEach((trip) => {
      const reportItem = {
        label: trip.department,
        value: 0
      };
      if (trip.minDate && trip.maxDate) {
        const dateDiffInMonths = Utils
          .dateDiffInMonths(trip.minDate, trip.maxDate) || 1;
        const averageTrips = (trip.totalTrips / dateDiffInMonths);
        reportItem.value = Math.ceil(averageTrips);
      }
      report.push(reportItem);
    });
    return report;
  }

  static async getTripsPerMonth(req, res) {
    const { location } = req.user;
    const andelaCenters = TravelChecklistHelper.getAndelaCenters();
    try {
      const trips = await models.Request.findAll({
        group: ['department'],
        raw: true,
        attributes: [
          'department',
          [models.sequelize.fn('COUNT', models.sequelize.col('trips.id')), 'totalTrips'],
          [models.sequelize.fn('MIN', models.sequelize.col('trips.departureDate')), 'minDate'],
          [models.sequelize.fn('MAX', models.sequelize.col('trips.departureDate')), 'maxDate'],
        ],
        where: { status: { [Op.ne]: 'Rejected' } },
        include: [{
          model: models.Trip,
          where: { origin: andelaCenters[`${location}`] },
          as: 'trips',
          attributes: [],
        }]
      });
      const report = TripsController.generateAnalysis(trips);
      if (req.query.type === 'file') {
        const fields = ['label', 'value'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(report);
        return res.attachment('Departmental Trips Per Month Report.csv').send(csv);
      }
      return res.status(200).json({ success: true, data: report });
    } catch (error) { /* istanbul ignore next */
      return Error.handleError(error.toString(), 500, res);
    }
  }
}

export default TripsController;
