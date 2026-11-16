const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

async function get(req, res) {
  const db = getDb();
  const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) });
  res.render('profile', { user, error: null });
}

async function update(req, res) {
  const db = getDb();
  const { email, username } = req.body;

  // VULN-08: profile update lacks anti-CSRF and any re-authentication.
  // INTENTIONALLY INSECURE — see VULN-08.
  await db.collection('users').updateOne(
    { _id: new ObjectId(req.session.userId) },
    { $set: { email, username } }
  );

  res.redirect('/profile');
}

module.exports = { get, update };
