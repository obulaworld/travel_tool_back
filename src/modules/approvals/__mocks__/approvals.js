const ApprovalsController = {
  getUserApprovals: jest.fn((req, res, next) => { // eslint-disable-line
    return res.send({});
  })
};

export default ApprovalsController;
