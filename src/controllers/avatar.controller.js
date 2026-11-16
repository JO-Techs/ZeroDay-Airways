const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'avatars');

async function upload(req, res) {
  const db = getDb();
  const file = req.file;

  // VULN-06: unrestricted file upload to public directory.
  // INTENTIONALLY INSECURE — see VULN-06.
  const filename = file ? file.filename : 'avatar-placeholder.png';
  await db.collection('users').updateOne({ _id: new ObjectId(req.session.userId) }, { $set: { avatarUrl: '/uploads/avatars/' + filename } });
  res.redirect('/profile');
}

async function importFromUrl(req, res) {
  const db = getDb();
  const url = req.body.url;

  // VULN-10: SSRF and raw network fetch without validation.
  // INTENTIONALLY INSECURE — see VULN-10.
  const response = await axios.get(url);
  const filename = 'imported-' + Date.now() + '.img';
  const finalPath = path.join(uploadDir, filename);
  fs.writeFileSync(finalPath, response.data);

  await db.collection('users').updateOne({ _id: new ObjectId(req.session.userId) }, { $set: { avatarUrl: '/uploads/avatars/' + filename } });
  res.redirect('/profile');
}

module.exports = { upload, importFromUrl };
