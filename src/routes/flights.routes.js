const express = require('express');
const flightsController = require('../controllers/flights.controller');

const router = express.Router();

router.get('/', flightsController.home);
router.get('/search', flightsController.search);
router.get('/flight/:id', flightsController.detail);
router.get('/challenges', flightsController.challenges);

module.exports = router;
