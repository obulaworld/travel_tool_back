import Sequelize from 'sequelize';

const { Op } = Sequelize;

const getTravelDocument = (documentId, models) => models.TravelReadinessDocuments.findOne({
  where: { id: documentId },
  include: [
    {
      model: models.Comment,
      as: 'comments',
      include: [{
        model: models.User,
        as: 'user',
      }]
    }]
});
const getSearchQuery = (query) => {
  const searchQuery = {
    [Op.and]: {
      [Op.or]: {
        fullName: {
          $ilike: `${query}%`
        },
        department: {
          $ilike: `${query}%`
        }
      }
    }
  };
  return searchQuery;
};
export {
  getTravelDocument,
  getSearchQuery
};
