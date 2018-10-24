
const getRequests = (requestId, models) => models.Request.find({
  where: { id: requestId },
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
