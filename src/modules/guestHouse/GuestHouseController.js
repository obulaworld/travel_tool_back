import dotenv from 'dotenv';
import Utils from '../../helpers/Utils';
import models from '../../database/models';
import Error from '../../helpers/Error';
import BedName from '../../helpers/guestHouse/index';

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

  // Update rooms
  static async updateRooms(rooms, res) {
    const updatedRooms = await Promise.all(
      rooms.map(async (room) => {
        const foundRoom = await models.Room.findById(room.id);
        if (!foundRoom) {
          return Error.handleError('Room does not exist', 404, res);
        }
        const updateRoom = await foundRoom.update({
          roomName: room.roomName || foundRoom.roomName,
          roomType: room.roomType || foundRoom.roomType,
          beds: room.bedCount || foundRoom.bedCount
        });
        return updateRoom.dataValues;
      })
    );

    return updatedRooms;
  }

  // Update beds
  static async updateBeds(rooms, res) {
    const updatedBeds = await Promise.all(
      rooms.map(async (room) => {
        let availableBedNames;
        const roomId = room.id;
        const newBedNumbers = Number(room.bedCount);
        const BookedBeds = await models.Bed
          .findAll({ where: { roomId, booked: true }, raw: true });
        if (BookedBeds.length > newBedNumbers) {
          return Error.handleError(`There are currently ${BookedBeds.length} booked beds unable to update beds`, 409, res);
        }
        const foundBeds = await models.Bed.findAll({ where: { roomId }, raw: true });
        if (newBedNumbers === foundBeds.length) { return foundBeds; }
        let numberOfBedsToCreate;
        if (newBedNumbers > foundBeds.length) {
          numberOfBedsToCreate = Math.abs(newBedNumbers - foundBeds.length);
          availableBedNames = BedName.getAvailableBedNames(newBedNumbers, foundBeds);
        } else {
          await models.Bed.destroy({ where: { roomId, booked: false } });
          availableBedNames = (BookedBeds.length)
            ? BedName.getAvailableBedNames(foundBeds.length, BookedBeds) : [];
          numberOfBedsToCreate = Math.abs(newBedNumbers - BookedBeds.length);
        }
        const newBeds = [];
        for (let i = 0; i < numberOfBedsToCreate; i += 1) {
          const newBed = { roomId, bedName: availableBedNames[i] || `bed ${i + 1}` };
          newBeds.push(newBed);
        }
        await models.Bed.bulkCreate(newBeds);
        const createdBeds = await models.Bed.findAll({ where: { roomId } });
        return createdBeds;
      })
    );
    return updatedBeds;
  }

  // Update guest house center and return expected response data
  static async editGuestHouse(req, res) {
    try {
      const {
        houseName,
        location,
        bathRooms,
        imageUrl,
        rooms
      } = req.body;
      await models.sequelize.transaction(async () => {
        const foundGuestHouse = await models.GuestHouse.findOne({
          where: { id: req.params.id }
        });
        if (!foundGuestHouse) {
          return Error.handleError('Guest house does not exist', 404, res);
        }
        const updatedGuestHouse = await foundGuestHouse.update({
          houseName: houseName || foundGuestHouse.houseName,
          location: location || foundGuestHouse.location,
          bathRooms: bathRooms || foundGuestHouse.bathRooms,
          imageUrl: imageUrl || foundGuestHouse.imageUrl
        });

        const updatedRooms = await GuestHouseController.updateRooms(rooms, res);
        const updatedBeds = await GuestHouseController.updateBeds(rooms, res);
        return res.status(200).json({
          success: true,
          message: 'Guest house updated successfully',
          guestHouse: updatedGuestHouse,
          rooms: updatedRooms,
          bed: updatedBeds
        });
      });
    } catch (error) {
      /* istanbul ignore next */
      return Error.handleError('Server Error', 500, res);
    }
  }
}

export default GuestHouseController;
