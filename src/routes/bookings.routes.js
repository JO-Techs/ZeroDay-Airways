const express = require('express');
const bookingsController = require('../controllers/bookings.controller');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.post('/', isLoggedIn, bookingsController.create);
router.get('/', isLoggedIn, bookingsController.mine);
router.get('/:id', bookingsController.getById);
router.post('/:id/cancel', bookingsController.cancel);

module.exports = router;
