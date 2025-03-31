const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

router.get('/get/all', countryController.getAllContries);
router.post('/convert', countryController.convertCurrencies);

module.exports = router;