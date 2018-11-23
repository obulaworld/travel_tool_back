import models from '../database/models';

class Centers {
  static async getCenter(locationQuery) {
    const [city] = locationQuery.split(',');
    const cityRegex = new RegExp(`^${city},`);
    const centers = await models.Center.findAll({
      raw: true,
      attributes: ['location']
    });
    const center = centers.find(data => cityRegex.test(data.location));
    return center.location;
  }
}

export default Centers;
