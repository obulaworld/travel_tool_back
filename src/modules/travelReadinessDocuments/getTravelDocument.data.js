
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

export default getTravelDocument;
