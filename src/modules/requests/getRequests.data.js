
const getRequests = (requestId, userId, models) => models.Request.find({
  where: { id: requestId, userId },
  include: [
    'comments', {
      model: models.Trip,
      as: 'trips',
      include: [{
        model: models.Bed,
        as: 'beds',
        include: [{
          model: models.Room,
          as: 'rooms',
          include: [{
            model: models.GuestHouse,
            as: 'guestHouses'
          }]
        }]
      }]
    }]
});

export default getRequests;
