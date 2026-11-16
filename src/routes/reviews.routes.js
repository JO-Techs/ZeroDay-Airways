const express = require('express');
const reviewsController = require('../controllers/reviews.controller');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.post('/', isLoggedIn, reviewsController.post);

module.exports = router;
