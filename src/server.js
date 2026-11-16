const path = require('path');
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');

const flightsRoutes = require('./routes/flights.routes');
const authRoutes = require('./routes/auth.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const boardingPassRoutes = require('./routes/boardingpass.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const profileRoutes = require('./routes/profile.routes');
const avatarRoutes = require('./routes/avatar.routes');
const adminRoutes = require('./routes/admin.routes');
const { connect } = require('./config/db');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

app.use((req, res, next) => {
  res.locals.user = req.session && req.session.user ? req.session.user : null;
  res.locals.role = req.session && req.session.role ? req.session.role : 'guest';
  res.locals.appName = 'ZeroDay Airways';
  next();
});

app.use('/', flightsRoutes);
app.use('/auth', authRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/boarding-pass', boardingPassRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/profile', profileRoutes);
app.use('/avatar', avatarRoutes);
app.use('/admin', adminRoutes);

app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

app.use((req, res) => {
  res.status(404).render('error', {
    message: 'The page you requested could not be found.',
    stack: null,
    appName: 'ZeroDay Airways'
  });
});

app.use((err, req, res, next) => {
  // VULN-09: error handler prints full stack trace to the browser.
  // INTENTIONALLY INSECURE — see VULN-09.
  console.error(err);
  res.status(500).render('error', {
    message: err.message || 'Internal server error',
    stack: err.stack || null,
    appName: 'ZeroDay Airways'
  });
});

async function start() {
  await connect();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZeroDay Airways listening on http://127.0.0.1:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start app:', error);
  process.exit(1);
});
