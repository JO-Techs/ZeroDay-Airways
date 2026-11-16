const { getDb } = require('../config/db');

async function post(req, res) {
  const db = getDb();
  const flightId = req.body.flightId;
  const rating = Number(req.body.rating || 5);
  const body = req.body.body || '';

  // VULN-02: user review is stored raw and later rendered as HTML.
  // INTENTIONALLY INSECURE — see VULN-02.
  await db.collection('reviews').insertOne({
    flightId,
    userId: req.session.userId,
    username: req.session.user,
    rating,
    body,
    createdAt: new Date()
  });

  res.redirect('/flight/' + flightId);
}

module.exports = { post };
