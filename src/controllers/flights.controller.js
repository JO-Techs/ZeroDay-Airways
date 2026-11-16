const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

async function home(req, res) {
  const db = getDb();
  const flights = await db.collection('flights').find({}).limit(4).toArray();
  res.render('index', { flights, user: req.session.user || null });
}

async function search(req, res) {
  const db = getDb();
  const from = (req.query.from || '').toString();
  const to = (req.query.to || '').toString();
  // VULN-03: reflected XSS from raw search query values.
  // INTENTIONALLY INSECURE — see VULN-03.
  const flights = await db.collection('flights').find({
    origin: { $regex: from, $options: 'i' },
    destination: { $regex: to, $options: 'i' }
  }).toArray();

  res.render('search', { flights, q: req.query, appName: 'ZeroDay Airways' });
}

async function detail(req, res) {
  const db = getDb();
  const flight = await db.collection('flights').findOne({ _id: new ObjectId(req.params.id) });
  const reviews = await db.collection('reviews')
    .find({ flightId: flight ? flight._id.toString() : '' })
    .sort({ createdAt: -1 })
    .toArray();

  if (!flight) {
    return res.status(404).render('error', { message: 'Flight not found', stack: null });
  }

  res.render('flight', { flight, reviews, user: req.session.user || null });
}

async function challenges(req, res) {
  const challenges = [
    { id: 'VULN-01', name: 'NoSQL Injection', owasp: 'A03:2021' },
    { id: 'VULN-02', name: 'Stored XSS', owasp: 'A03:2021' },
    { id: 'VULN-03', name: 'Reflected XSS', owasp: 'A03:2021' },
    { id: 'VULN-04', name: 'IDOR / Broken Access Control', owasp: 'A01:2021' },
    { id: 'VULN-05', name: 'Weak Auth / Brute Force', owasp: 'A07:2021' },
    { id: 'VULN-06', name: 'Unrestricted File Upload', owasp: 'A05:2021' },
    { id: 'VULN-07', name: 'Path Traversal', owasp: 'A01:2021' },
    { id: 'VULN-08', name: 'CSRF', owasp: 'A01:2021' },
    { id: 'VULN-09', name: 'Security Misconfiguration', owasp: 'A05:2021' },
    { id: 'VULN-10', name: 'SSRF', owasp: 'A10:2021' }
  ];

  res.render('challenges', { challenges });
}

module.exports = { home, search, detail, challenges };
