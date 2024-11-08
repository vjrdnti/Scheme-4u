const express = require('express');
const { submitFirstTimeForm, furtherCounselling, submitSecondTimeForm, getDropdownData } = require('../controllers/formController');
const validateUser = require('../validators/emailValidator');  // Import the validator

const router = express.Router();

// Routes for form submission
router.post('/first-time', validateUser, submitFirstTimeForm);  // Apply validation here
router.post('/further-counselling', furtherCounselling);
router.post('/not-first-time', submitSecondTimeForm);
//router.post('/filter-schemes', getFilteredSchemes);
router.get('/dropdown-data', getDropdownData);


module.exports = router;

