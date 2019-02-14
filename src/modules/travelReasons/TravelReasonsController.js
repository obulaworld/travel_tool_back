import models from '../../database/models';
import CustomError from '../../helpers/Error';
import Pagination from '../../helpers/Pagination';

export default class TravelReasonsController {
  static async createTravelReason(req, res) {
    try {
      const { id, title, description } = req.body;

      const lowerCaseTitle = title.toLowerCase();
      const newReason = await models.TravelReason.create({
        title: lowerCaseTitle,
        description,
        createdBy: id
      });

      if (newReason) {
        return res.status(201).json({
          success: true,
          message: 'Successfully created a travel reason',
          travelReason: newReason
        });
      }
    } catch (error) {
    /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }

  static async getTravelReasons(req, res) {
    try {
      const { query: { page } } = req;
      const limit = req.query.limit && req.query.limit > 0 ? req.query.limit : 10;
      const { options } = Pagination;
      const { countOptions, findOptions } = options(req);
      const count = await models.TravelReason.count(countOptions);
      const pageCount = Math.ceil(count / limit);
      const currentPage = page < 1 || !page || pageCount === 0 ? 1 : Math.min(page, pageCount);
      const offset = limit * (currentPage - 1);
      const travelReasons = await models.TravelReason.findAll({
        ...findOptions, limit, offset, order: [['id', 'DESC']]
      });
      return res.status(200).json({
        success: true,
        message: 'success',
        metaData: {
          travelReasons,
          pagination: {
            pageCount,
            currentPage,
            count
          }
        }
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError(error.message, 500, res);
    }
  }
}
