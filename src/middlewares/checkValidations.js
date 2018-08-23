import { validationResult } from 'express-validator/check';

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({
        success: false,
        error: errors.array(),
      });
  }
  next();
};

export default checkValidations;
