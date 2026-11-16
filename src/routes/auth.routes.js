const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/login', (req, res) => res.render('login', { error: null }));
router.post('/login', authController.login);
router.get('/register', (req, res) => res.render('register', { error: null }));
router.post('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;
