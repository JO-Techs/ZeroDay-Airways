const express = require('express');
const boardingPassController = require('../controllers/boardingpass.controller');

const router = express.Router();

router.get('/', boardingPassController.download);

module.exports = router;
