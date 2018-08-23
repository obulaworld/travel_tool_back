import { query } from 'express-validator/check';

const validators = [
  query('status', 'Status must be "open", "past", "approved" or "rejected"')
    .isIn(['open', 'approved', 'past', 'rejected'])
    .optional(),
  query('page', 'Page must be a positive integer')
    .isInt({ gt: 0 })
    .optional(),
  query('limit', 'Limit must be a positive integer')
    .isInt({ gt: 0 })
    .optional(),
];

export default validators;
