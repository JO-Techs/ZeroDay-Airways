const { getDb } = require('../config/db');

async function dashboard(req, res) {
  const db = getDb();
  const users = await db.collection('users').find({}).toArray();
  const bookings = await db.collection('bookings').find({}).toArray();
  res.render('admin', { users, bookings, user: req.session.user || null });
}

function debug(req, res) {
  // VULN-09: unauthenticated debug route exposing host and session info.
  // INTENTIONALLY INSECURE — see VULN-09.
  res.json({
    env: process.env,
    session: req.session,
    headers: req.headers
  });
}

module.exports = { dashboard, debug };
