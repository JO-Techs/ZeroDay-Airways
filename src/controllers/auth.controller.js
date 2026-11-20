const { getDb } = require('../config/db');

async function register(req, res) {
  const db = getDb();
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render('register', { error: 'All fields are required', user: null });
  }

  // VULN-01 + VULN-05: plaintext password storage and trust of raw request input.
  // INTENTIONALLY INSECURE — see VULN-01 and VULN-05.
  await db.collection('users').insertOne({
    username,
    email,
    password,
    role: 'user',
    loyaltyTier: 'Silver',
    miles: 0,
    avatarUrl: '',
    createdAt: new Date()
  });

  res.redirect('/login');
}

async function login(req, res) {
  const db = getDb();
  const { username, password } = req.body;

  // VULN-01: NoSQL injection through direct MongoDB query parameters.
  // INTENTIONALLY INSECURE — see VULN-01.
  const user = await db.collection('users').findOne({
    $or: [
      { username: req.body.username, password: req.body.password },
      { email: req.body.username, password: req.body.password }
    ]
  });

  if (user) {
    req.session.user = user.username;
    req.session.role = user.role;
    req.session.userId = user._id.toString();
    return res.redirect('/');
  }

  return res.render('login', { error: 'Invalid credentials' });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

module.exports = { register, login, logout };
