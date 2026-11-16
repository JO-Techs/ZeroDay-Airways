const express = require('express');
const adminController = require('../controllers/admin.controller');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', isLoggedIn, isAdmin, adminController.dashboard);
router.get('/debug', adminController.debug);

module.exports = router;
