const express = require('express');
const multer = require('multer');
const path = require('path');
const avatarController = require('../controllers/avatar.controller');
const { isLoggedIn } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'avatars');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.single('avatar'), isLoggedIn, avatarController.upload);
router.post('/import', isLoggedIn, avatarController.importFromUrl);

module.exports = router;
