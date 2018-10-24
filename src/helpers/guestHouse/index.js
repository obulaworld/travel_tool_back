import models from '../../database/models';

class BedName {
  static numberRange(start, end) {
    return Array(end - start + 1).fill().map((item, index) => start + index);
  }

  static getAvailableBedNames(max, bedNamesTaken) {
    // Get available bed names
    const maxBedNumber = this.numberRange(1, max);
    const bedNameValues = bedNamesTaken.map(bed => bed.bedName);
    const availableBedNames = [];
    maxBedNumber.map((num) => {
      if (!bedNameValues.includes(`bed ${num}`)) {
        availableBedNames.push(`bed ${num}`);
      }
      return num;
    });

    return availableBedNames;
  }
}


export class GuestHouseIncludeHelper {
  static doInclude(modelName, alias, where = {}, required = true) {
    return {
      model: models[modelName],
      as: alias,
      where,
      required // set false to enforce a LEFT OUTER JOIN
    };
  }

  static makeTripsDateClauseFrom(reqQuery) {
    const { startDate, endDate } = reqQuery;
    const { makeTripsWhereClauseFor } = GuestHouseIncludeHelper;

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

  static makeTripsWhereClauseFor(column, operatorType, startDate, endDate) {
    const { Op } = models.Sequelize;
    const { sequelize } = models;
    const operator = Op[operatorType]; // Op.between, Op.lt ...
    const opValue = operatorType === 'between'
      ? [startDate, endDate]
      : startDate;
    return sequelize.where(sequelize.col(column), { [operator]: opValue });
  }
}

export default BedName;
