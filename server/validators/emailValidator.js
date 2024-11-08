const { check, validationResult } = require('express-validator');


const validateUser = [
  check('email', 'Email is not valid').isEmail(),
  check('age', 'Age is required').not().isEmpty(),
  check('name', 'Name is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('phone', 'Phone number is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUser;

