class Users {
  static welcome(req, res) {
    res.status(200)
      .json({
        message: 'Welcome to Travel Tool',
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
