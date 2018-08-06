import { User } from '../../database/models';

class Users {
  static welcome(req, res) {
    res.status(200)
      .json({
        message: 'Welcome to Travel Tool',
      });
  }

  static register(req, res) {
    const { email, firstName, lastName } = req.body;

    // create a user
    User.create({
      firstName,
      lastName,
      email,
    })
      .then((user) => {
        res.status(200).json({
          message: 'Success',
          email: user.dataValues.email,
        });
      });
  }

  static login(req, res) {
    const { email } = req.body;
    res.status(200).json({
      message: 'Success',
      email,
    });
  }
}


export default Users;
