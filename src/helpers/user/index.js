import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

class UserHelper {
  static authorizeRequests(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  static getUserOnBamboo(bambooHRId) {
    const bambooAPIRoute = process.env.BAMBOOHR_API.replace('{bambooHRId}', bambooHRId);
    return axios.get(bambooAPIRoute, {
      headers: {
        Accept: 'application/json'
      }
    });
  }

  static getUserOnProduction(res) {
    const workEmail = res.dataValues ? res.dataValues.email : res.data.workEmail;
    return axios.get(
      `${process.env.ANDELA_PROD_API}/users?email=${workEmail}`
    );
  }

  static generateTravelaUser(productionUser, bambooUser) {
    const travelaUser = {
      fullName: productionUser.data.values[0].name,
      email: productionUser.data.values[0].email,
      userId: productionUser.data.values[0].id,
      passportName: productionUser.data.values[0].name,
      department: bambooUser.data.department,
      occupation: bambooUser.data.jobTitle,
      location: productionUser.data.values[0].location.name,
      picture: productionUser.data.values[0].picture,
      manager: bambooUser.data.supervisor
    };
    return travelaUser;
  }
}
export default UserHelper;
