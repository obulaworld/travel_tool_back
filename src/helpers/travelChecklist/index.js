import models from '../../database/models';
import TripsController from '../../modules/trips/TripsController';
import CustomError from '../Error';

class TravelChecklistHelper {
  static groupCheckList(checklists, groupBy) {
    const modifiedChecklist = checklists.reduce((groupedList, item) => {
      const newGroup = groupedList;
      const val = item[groupBy];
      newGroup[val] = newGroup[val] || [];
      newGroup[val].push(item);
      return newGroup;
    }, {});
    const groupedCheckList = Object.keys(modifiedChecklist).map(key => ({
      destination: key,
      checklist: modifiedChecklist[key]
    }));
    return groupedCheckList;
  }

  static async getChecklistFromDb(query, res) {
    try {
      const checklists = await models.ChecklistItem.findAll(query);
      const groupedCheckList = TravelChecklistHelper
        .groupCheckList(checklists, 'destinationName');
      return { checklists: groupedCheckList };
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError('Server Error', 500, res);
    }
  }

  static async getChecklists(req, res) {
    try {
      const { requestId, destinationName } = req.query;
      let where = {};

      if (requestId) {
        const trips = await TripsController.getTripsByRequestId(requestId, res);
        const tripsDestination = trips.map(trip => trip.destination);
        where = { destinationName: tripsDestination };
      } else if (destinationName) {
        const andelaCenters = TravelChecklistHelper.getAndelaCenters();
        where = { destinationName: andelaCenters[`${destinationName}`] };
      }

      const query = {
        where,
        attributes:
        ['id', 'name', 'requiresFiles', 'destinationName', 'deleteReason'],
        order: [['destinationName', 'ASC']],
        include: [{
          model: models.ChecklistItemResource,
          as: 'resources',
          attributes: ['id', 'label', 'link', 'checklistItemId']
        }]
      };

      const checklists = await TravelChecklistHelper
        .getChecklistFromDb(query, res);

      return checklists;
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error, 500, res);
    }
  }

  static getAndelaCenters() {
    const andelaCenters = {
      Lagos: 'Lagos, Nigeria',
      Nairobi: 'Nairobi, Kenya',
      Kigali: 'Kigali, Rwanda',
      'New York': 'New York, United States',
      Kampala: 'Kampala, Uganda'
    };

    return andelaCenters;
  }
}

export default TravelChecklistHelper;
