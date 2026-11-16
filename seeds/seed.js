const { MongoClient, ObjectId } = require('mongodb');

async function main() {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/zeroday';
  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db();

  for (const collectionName of ['users', 'flights', 'bookings', 'reviews']) {
    await db.collection(collectionName).drop().catch(() => {});
  }

  const flights = [
    { _id: new ObjectId('64c7d1f4c9d89b200d001001'), flightNumber: 'ZA101', origin: 'JFK', destination: 'LHR', departTime: '08:00', arriveTime: '20:00', price: 850, seatsAvailable: 42, aircraft: 'Boeing 787' },
    { _id: new ObjectId('64c7d1f4c9d89b200d001002'), flightNumber: 'ZA202', origin: 'LHR', destination: 'JFK', departTime: '10:00', arriveTime: '22:00', price: 920, seatsAvailable: 38, aircraft: 'Boeing 787' },
    { _id: new ObjectId('64c7d1f4c9d89b200d001003'), flightNumber: 'ZA303', origin: 'DEL', destination: 'DXB', departTime: '06:00', arriveTime: '09:00', price: 320, seatsAvailable: 60, aircraft: 'Airbus A320' },
    { _id: new ObjectId('64c7d1f4c9d89b200d001004'), flightNumber: 'ZA404', origin: 'DXB', destination: 'DEL', departTime: '23:00', arriveTime: '02:00', price: 340, seatsAvailable: 55, aircraft: 'Airbus A320' },
    { _id: new ObjectId('64c7d1f4c9d89b200d001005'), flightNumber: 'ZA505', origin: 'SFO', destination: 'NRT', departTime: '11:00', arriveTime: '15:00', price: 1100, seatsAvailable: 30, aircraft: 'Boeing 777' },
    { _id: new ObjectId('64c7d1f4c9d89b200d001006'), flightNumber: 'ZA606', origin: 'NRT', destination: 'SFO', departTime: '17:00', arriveTime: '09:00', price: 1150, seatsAvailable: 28, aircraft: 'Boeing 777' },
    { _id: new ObjectId('64c7d1f4c9d89b200d001007'), flightNumber: 'ZA707', origin: 'BOM', destination: 'SIN', departTime: '14:00', arriveTime: '21:00', price: 450, seatsAvailable: 48, aircraft: 'Airbus A330' },
    { _id: new ObjectId('64c7d1f4c9d89b200d001008'), flightNumber: 'ZA808', origin: 'SIN', destination: 'BOM', departTime: '23:30', arriveTime: '02:30', price: 470, seatsAvailable: 44, aircraft: 'Airbus A330' }
  ];

  const users = [
    { username: 'admin', email: 'admin@zeroday.airways', password: 'admin123', role: 'admin', loyaltyTier: 'Platinum', miles: 95000, avatarUrl: '', createdAt: new Date() },
    { username: 'joel', email: 'joel@zeroday.airways', password: 'password123', role: 'user', loyaltyTier: 'Gold', miles: 42000, avatarUrl: '', createdAt: new Date() },
    { username: 'alna', email: 'alna@zeroday.airways', password: 'alna123', role: 'user', loyaltyTier: 'Silver', miles: 8000, avatarUrl: '', createdAt: new Date() },
    { username: 'abin', email: 'abin@zeroday.airways', password: 'abin123', role: 'user', loyaltyTier: 'Silver', miles: 6500, avatarUrl: '', createdAt: new Date() },
    { username: 'eve', email: 'eve@zeroday.airways', password: 'eve123', role: 'user', loyaltyTier: 'Silver', miles: 1200, avatarUrl: '', createdAt: new Date() }
  ];

  const insertedUsers = await db.collection('users').insertMany(users);

  const bookings = [
    { _id: new ObjectId('64c7d1f4c9d89b200d002001'), userId: insertedUsers.insertedIds[1].toString(), flightId: flights[0]._id, bookingCode: 'ZA-8F3K2', passengers: [{ name: 'Joel', passport: 'P123', seat: '12A' }], totalPrice: flights[0].price, status: 'confirmed', createdAt: new Date() },
    { _id: new ObjectId('64c7d1f4c9d89b200d002002'), userId: insertedUsers.insertedIds[3].toString(), flightId: flights[2]._id, bookingCode: 'ZA-9X7M1', passengers: [{ name: 'Abin', passport: 'P456', seat: '7C' }], totalPrice: flights[2].price, status: 'confirmed', createdAt: new Date() },
    { _id: new ObjectId('64c7d1f4c9d89b200d002003'), userId: insertedUsers.insertedIds[0].toString(), flightId: flights[4]._id, bookingCode: 'ZA-2Q4R8', passengers: [{ name: 'Admin', passport: 'P789', seat: '1A' }], totalPrice: flights[4].price, status: 'confirmed', createdAt: new Date() }
  ];

  const reviews = [
    { _id: new ObjectId('64c7d1f4c9d89b200d003001'), flightId: flights[0]._id.toString(), userId: insertedUsers.insertedIds[1].toString(), username: 'joel', rating: 5, body: 'Smooth flight, great crew.', createdAt: new Date() },
    { _id: new ObjectId('64c7d1f4c9d89b200d003002'), flightId: flights[2]._id.toString(), userId: insertedUsers.insertedIds[2].toString(), username: 'alna', rating: 4, body: 'On time and comfortable.', createdAt: new Date() }
  ];

  await db.collection('flights').insertMany(flights);
  await db.collection('bookings').insertMany(bookings);
  await db.collection('reviews').insertMany(reviews);

  console.log('Seed complete.');
  await client.close();
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
