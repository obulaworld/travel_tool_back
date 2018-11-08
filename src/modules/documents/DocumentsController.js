import models from '../../database/models';
import CustomError from '../../helpers/Error';

const { Op } = models.Sequelize;

export default class DocumentsController {
  static async fetchDocuments(req, res) {
    const query = { name: req.query.search || '' };
    try {
      const userId = req.user.UserInfo.id;
      const documents = await models.Document.findAll({
        order: [['createdAt', 'ASC']],
        where: {
          userId,
          name: {
            [Op.iLike]: `%${query.name}%`,
          }
        }
      });
      if (documents.length < 1) {
        return CustomError.handleError('No documents found', 404, res);
      }
      return res.status(200).json({
        success: true,
        message: 'Successfully retrieved your documents',
        documents
      });
    } catch (error) { /* istanbul ignore next */
      CustomError.handleError('Server Error', 500, res);
    }
  }
}
