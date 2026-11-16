const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

function generateBookingCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '0123456789';
  let code = 'ZA-';
  for (let i = 0; i < 5; i += 1) {
    code += i % 2 === 0 ? letters[Math.floor(Math.random() * letters.length)] : digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

async function create(req, res) {
  const db = getDb();
  const flightId = req.body.flightId;
  const flight = await db.collection('flights').findOne({ _id: new ObjectId(flightId) });

  if (!flight) {
    return res.status(404).send('Flight not found');
  }

  const booking = {
    userId: req.session.userId,
    flightId: flight._id,
    bookingCode: generateBookingCode(),
    passengers: [{ name: req.body.passengerName || 'Guest', passport: 'N/A', seat: 'A1' }],
    totalPrice: flight.price,
    status: 'confirmed',
    createdAt: new Date()
  };

  // VULN-08: booking creation is vulnerable to cross-site request forgery.
  // INTENTIONALLY INSECURE — see VULN-08.
  const result = await db.collection('bookings').insertOne(booking);
  res.redirect(`/bookings/${result.insertedId}`);
}

async function mine(req, res) {
  const db = getDb();
  const bookings = await db.collection('bookings').find({ userId: req.session.userId }).toArray();
  res.render('my-bookings', { bookings, user: req.session.user || null });
}

async function getById(req, res) {
  const db = getDb();
  // VULN-04: IDOR — object ID is trusted without ownership check.
  // INTENTIONALLY INSECURE — see VULN-04.
  const booking = await db.collection('bookings').findOne({ _id: new ObjectId(req.params.id) });

  if (!booking) {
    return res.status(404).render('error', { message: 'Booking not found', stack: null });
  }

  const flight = await db.collection('flights').findOne({ _id: booking.flightId });
  return res.render('booking', { booking, flight, user: req.session.user || null });
}

async function cancel(req, res) {
  const db = getDb();
  const { id } = req.params;
  const objectId = new ObjectId(id);

  // VULN-04 + VULN-08: no ownership check and no CSRF validation.
  // INTENTIONALLY INSECURE — see VULN-04 and VULN-08.
  await db.collection('bookings').updateOne({ _id: objectId }, { $set: { status: 'cancelled' } });
  res.redirect('/bookings');
}

module.exports = { create, mine, getById, cancel };
