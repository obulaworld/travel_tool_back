import dotenv from 'dotenv';
import Utils from '../../helpers/Utils';
import models from '../../database/models';
import Error from '../../helpers/Error';

dotenv.config();

class GuestHouseController {
  static async postGuestHouse(req, res) {
    const { rooms, ...data } = req.body;
    const generateId = Utils.generateUniqueId();
    const user = req.user.UserInfo.id;
    let createdRooms;
    const guestHouse = { ...data, userId: user, id: generateId };
    await models.sequelize.transaction(async () => {
      const house = await models.GuestHouse.create(guestHouse);
      createdRooms = await models.Room.bulkCreate(rooms.map(room => ({
        ...room, id: Utils.generateUniqueId(), guestHouseId: house.id
      })));
      const makeBed = await Promise.all(
        createdRooms.map(async (roomId) => {
          const bedNumber = roomId.bedCount;
          const createdBed = Promise.all(
            new Array(+bedNumber).fill(1).map((_, i) => {
              const newBed = models.Bed.create({
                roomId: roomId.id,
                bedName: `bed ${i + 1}`
              });
              return newBed;
            })
          );
          return createdBed;
        })
      );
      res.status(201).json({
        success: true,
        message: 'Guest House created successfully',
        guestHouse: house,
        rooms: createdRooms,
        bed: makeBed
      });
    });
  }

  static async getGuestHouses(req, res) {
    try {
      const guestHouses = await models.GuestHouse.findAll({
        include: ['rooms']
      });
      const message = guestHouses.length === 0
        ? 'No guesthouse exists at the moment'
        : 'Guesthouses retrieved successfully';
      return res.status(200).json({
        success: true,
        message,
        guestHouses
      });
    } catch (error) { /* istanbul ignore next */
      Error.handleError(error, 500, res);
    }
  }
}

export default GuestHouseController;
