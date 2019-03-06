import _ from 'lodash';
import UserRoleController from '../userRole/UserRoleController';
import TravelReadinessUtils from '../travelReadinessDocuments/TravelReadinessUtils';
import NotificationEngine from '../notifications/NotificationEngine';
import models from '../../database/models';
import Error from '../../helpers/Error';
import ApprovalsController from './ApprovalsController';

export default class BudgetApprovalsController {
  static async budgetCheckerEmailNotification(
    id,
    userId,
    requesterName,
    manager
  ) {
    const requesterId = userId;
    const { location: userLocation } = await models.User.find({
      where: {
        userId: requesterId
      }
    });
    const { users: budgetChecker } = await UserRoleController.calculateUserRole('60000');
    const budgetCheckerMembers = await TravelReadinessUtils
      .getRoleMembers(budgetChecker, userLocation);
    const data = {
      sender: requesterName,
      topic: 'Travel Request Approval',
      type: 'Notify budget checker',
      details: { RequesterManager: manager, id },
      redirectLink: `${process.env.REDIRECT_URL}/requests/${id}`
    };
    if (budgetCheckerMembers.length) {
      NotificationEngine.sendMailToMany(
        budgetCheckerMembers,
        data
      );
      return true;
    }
  }


  static async getBudgetApprovals(req, res) {
    const { query: { budgetStatus } } = req;

    req.query.budgetStatus = _.capitalize(budgetStatus);
    req.query.checkBudget = true;

    try {
      await ApprovalsController.processQuery(req, res, true);
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError('Server error', 500, res);
    }
  }
}
