import models from '../../database/models';

const { Op } = models.Sequelize;
class RoomsManager {
  static async fetchAvailableRooms({
    arrivalDate,
    departureDate,
    location,
    gender
  }) {
    const bookedBeds = await RoomsManager.fetchBookedRooms({
      arrivalDate,
      departureDate,
      location
    });
    const faultyBeds = await RoomsManager.fetchFaultyBeds();
    const oppositeGenderBeds = await RoomsManager.fetchOppositeGenderBeds({
      arrivalDate,
      departureDate,
      gender,
      location
    });

    const unavailableBeds = []
      .concat(
        bookedBeds.map(bed => Object.values(bed)),
        faultyBeds.map(bed => Object.values(bed)),
        oppositeGenderBeds.map(bed => Object.values(bed))
      )
      .map(list => list[0]);

    return models.Bed.findAll({
      where: {
        id: {
          [Op.notIn]: unavailableBeds
        }
      },
      include: [
        {
          as: 'rooms',
          model: models.Room,
          required: true,
          include: [
            {
              as: 'guestHouses',
              model: models.GuestHouse,
              where: {
                location
              }
            }
          ]
        }
      ]
    });
  }

  static getDateRange(departureDate, arrivalDate) {
    let range = {
      departureDate: {
        [Op.gte]: new Date(departureDate),
        [Op.lte]: new Date(arrivalDate)
      },
      returnDate: {
        [Op.gte]: new Date(departureDate),
        [Op.lte]: new Date(arrivalDate)
      }
    };

    if (!arrivalDate) {
      range = {
        departureDate: {
          [Op.gte]: new Date(departureDate)
        },
        returnDate: {
          [Op.gte]: new Date(departureDate)
        }
      };
    }
    return range;
  }

  /**
   * @return[{ bedId: int }] - Array of bed ids that are booked within
   * the alloted timeframe.
   */
  static async fetchBookedRooms({ arrivalDate, departureDate, location }) {
    const bookedBeds = await models.Trip.findAll({
      attributes: ['bedId'],
      where: {
        destination: location,
        bedId: { [Op.ne]: null },
        [Op.or]: {
          [Op.and]: {
            departureDate: { [Op.lte]: departureDate },
            returnDate: { [Op.gte]: arrivalDate }
          },
          ...RoomsManager.getDateRange(departureDate, arrivalDate)
        }
      },
      raw: true
    });

    return bookedBeds;
  }

  /**
   * @return[{ id: int }] - Array of bed ids that are booked by or adjacent
   * to a bed booked by an opposite sex in the alloted timeframe.
   */
  static async fetchFaultyBeds() {
    // TODO: Filter beds that are not in faulty rooms
    // Can be changed later if bed is the one marked faulty and not room

    const faultyBeds = await models.Bed.findAll({
      attributes: ['id'],
      include: [
        {
          attributes: [],
          as: 'rooms',
          model: models.Room,
          where: { faulty: true }
        }
      ],
      raw: true
    });

    return faultyBeds;
  }

  /**
   * @return[{ id: int }] - Array of bed ids that are booked within
   * the alloted timeframe.
   */
  static async fetchOppositeGenderBeds({
    arrivalDate,
    departureDate,
    location,
    gender
  }) {
    const oppositeRequestSql = models.sequelize.dialect.QueryGenerator.selectQuery(
      'Requests',
      {
        attributes: ['id'],
        where: {
          gender: {
            [Op.ne]: gender
          }
        }
      }
    ).slice(0, -1);

    const oppositeBedIDSql = models.sequelize.dialect.QueryGenerator.selectQuery(
      'Trips',
      {
        attributes: ['bedId'],
        where: {
          destination: location,
          bedId: { [Op.ne]: null },
          [Op.or]: {
            ...RoomsManager.getDateRange(departureDate, arrivalDate)
          },
          requestId: {
            [Op.in]: models.sequelize.literal(`(${oppositeRequestSql})`)
          }
        }
      }
    ).slice(0, -1);

    const oppositeRoomIDSql = models.sequelize.dialect.QueryGenerator.selectQuery(
      'Beds',
      {
        attributes: ['roomId'],
        where: {
          id: {
            [Op.in]: models.sequelize.literal(`(${oppositeBedIDSql})`)
          }
        }
      }
    ).slice(0, -1);

    const oppositeBeds = await models.Bed.findAll({
      attributes: ['id'],
      where: {
        roomId: {
          [Op.in]: models.sequelize.literal(`(${oppositeRoomIDSql})`)
        }
      },
      raw: true
    });

    return oppositeBeds;
  }
}

export default RoomsManager;
