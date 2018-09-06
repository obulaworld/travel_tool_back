import models from '../../database/models';
import { createSubquery, countByStatus } from '../../helpers/requests';
import handleServerError from '../../helpers/serverError';
import Pagination from '../../helpers/Pagination';
import Utils from '../../helpers/Utils';

class ApprovalsController {
  static fillWithRequestData(approval) {
    const request = approval.Request;
    request.status = approval.status;
    return request;
  }

  static async getUserApprovals(req, res) {
    const { page, limit, offset } = Pagination.initializePagination(req);
    const userId = req.user.UserInfo.id;
    const { status } = req.query.status || '';
    // create query using `approverId` as the column name bearing the user id
    const subquery = createSubquery(req, limit, offset, 'Approval');
    subquery.include = ['Request'];

    try {
      const result = await models.Approval.findAndCountAll(subquery);
      const count = await countByStatus(models.Approval, userId);
      const pagination = Pagination.getPaginationData(page, limit, result);
      const { fillWithRequestData } = ApprovalsController;
      const message = Utils.getResponseMessage(pagination, status, 'Approval');
      const approvals = result.rows.map(fillWithRequestData);
      return res.status(200).json({
        success: true,
        message,
        approvals,
        meta: {
          count,
          pagination,
        },
      });
    } catch (error) { /* istanbul ignore next */
      return handleServerError('Server error', res);
    }
  }
}

export default ApprovalsController;
