import models from '../database/models';

const validateDirectReport = async (req, res, next) => {
  const { user } = req;
  const { requestId } = req.params;
  const request = await models.Request.findById(requestId);
  if (!request) {
    return res.status(404).json({
      success: false,
      error: 'Request not found',
    });
  }
  if (user.UserInfo.name !== request.manager) {
    return res.status(403).json({
      success: false,
      error: 'Permission denied, you are not requesters manager',
    });
  }
  req.request = request;
  return next();
};

export default validateDirectReport;
