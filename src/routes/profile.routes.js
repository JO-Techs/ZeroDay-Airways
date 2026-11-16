const express = require('express');
const profileController = require('../controllers/profile.controller');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.get('/', isLoggedIn, profileController.get);
router.post('/', isLoggedIn, profileController.update);

module.exports = router;
