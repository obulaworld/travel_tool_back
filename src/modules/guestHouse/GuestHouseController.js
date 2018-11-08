import dotenv from 'dotenv';
import Utils from '../../helpers/Utils';
import models from '../../database/models';
import Error from '../../helpers/Error';
import RoomsManager from './RoomsManager';
import {
  BedName, GuestHouseIncludeHelper, EditGuestHouseHelper
} from '../../helpers/guestHouse/index';

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
            new Array(+bedNumber).fill(1).map((__, i) => {
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

  static async updateRoomFaultyStatus(req, res) {
    const guestRoomId = req.params.id;
    const room = await models.Room.findOne({
      where: {
        id: guestRoomId
      }
    });
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'The room does not exist'
      });
    }
    const result = await room.update({
      faulty: req.body.fault
    });
    return res.status(201).json({
      success: true,
      message: 'Room maintainance details updated successfully',
      result
    });
  }

  static async getGuestHouses(req, res) {
    try {
      const guestHouses = await models.GuestHouse.findAll({
        include: [{
          as: 'rooms',
          model: models.Room,
          where: { isDeleted: false }
        }]
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

  static makeTripsWhereClauseFor(column, operatorType, startDate, endDate) {
    const { Op } = models.Sequelize;
    const { sequelize } = models;
    const operator = Op[operatorType]; // Op.between, Op.lt ...
    const opValue = operatorType === 'between'
      ? [startDate, endDate]
      : startDate;
    return sequelize.where(sequelize.col(column), { [operator]: opValue });
  }

  static makeTripsDateClauseFrom(reqQuery) {
    const { startDate, endDate } = reqQuery;
    const { makeTripsWhereClauseFor } = GuestHouseController;

    return models.sequelize.or(
      // pick a trip if its departureDate is between dates
      makeTripsWhereClauseFor('departureDate', 'between', startDate, endDate),
      /*  also include trips whose departureDate is less than startDate but
        touch into or span across the date range
      */
      models.sequelize.and(
        makeTripsWhereClauseFor('departureDate', 'lt', startDate),
        makeTripsWhereClauseFor('returnDate', 'gte', startDate)
      )
    );
  }

  static doInclude(modelName, alias, where = {}, required = true) {
    return {
      model: models[modelName],
      as: alias,
      where,
      required // set false to enforce a LEFT OUTER JOIN
    };
  }

  static async getGuestHouseDetails(req, res) {
    const { guestHouseId } = req.params;
    const { query } = req;

    const { doInclude, makeTripsDateClauseFrom } = GuestHouseIncludeHelper;
    const bedTripsWhereClause = makeTripsDateClauseFrom(query);
    const srcRequestWhereClause = { status: 'Approved' };
    const guestHouse = await models.GuestHouse.findOne({
      where: { id: guestHouseId },
      include: [{
        ...doInclude('Room', 'rooms'),
        where: { isDeleted: false },
        include: [{
          ...doInclude('Bed', 'beds'),
          include: [{
            // enforce a LEFT OUTER JOIN for trips `where`, set false on require
            ...doInclude('Trip', 'trips', bedTripsWhereClause, false),
            include: [{
              ...doInclude('Request', 'request', srcRequestWhereClause),
            }]
          }]
        }]
      }]
    });
    if (!guestHouse) {
      const error = `Guest house with id ${guestHouseId} does not exist`;
      return Error.handleError(error, 404, res);
    }
    res.status(200).json({
      guestHouse
    });
  }

  // Update beds
  static async updateBeds(rooms, res) {
    const updatedBeds = await Promise.all(
      rooms.map(async (room) => {
        let availableBedNames;
        const roomId = room.id;
        const newBedNumbers = Number(room.bedCount);
        const BookedBeds = await models.Bed.findAll({ where: { roomId, booked: true }, raw: true });
        if (BookedBeds.length > newBedNumbers) {
          return Error.handleError(`There are currently ${BookedBeds.length} booked beds, 
          unable to update bed numbers`, 409, res);
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
        houseName, location, bathRooms, imageUrl, rooms
      } = req.body;
      await models.sequelize.transaction(async () => {
        const foundGuestHouse = await models.GuestHouse.findOne({
          attributes: ['id'],
          where: { id: req.params.id }
        });
        const guestHouseData = Object.values(foundGuestHouse);
        const guestHouseId = guestHouseData[0].id;
        if (!guestHouseId) {
          return Error.handleError('Guest house does not exist', 404, res);
        }
        const updatedGuestHouse = await foundGuestHouse.update({
          houseName, location, bathRooms, imageUrl
        });
        const updatedRooms = await EditGuestHouseHelper.updateRooms(rooms, guestHouseId);
        const newUpdatedRoomsId = updatedRooms.map(updatedRoom => (updatedRoom.id));
        await EditGuestHouseHelper.deleteRoomsRemoved(guestHouseId, newUpdatedRoomsId);
        const updatedBeds = await GuestHouseController.updateBeds(updatedRooms, res);
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

  static async getAvailableRooms(req, res) {
    const {
      arrivalDate, departureDate, location, gender
    } = req.query;

    const beds = await RoomsManager.fetchAvailableRooms({
      arrivalDate, departureDate, location, gender
    });

    return res.status(200).json({
      success: true,
      message: 'Available rooms fetched',
      beds,
    });
  }
}

export default GuestHouseController;
