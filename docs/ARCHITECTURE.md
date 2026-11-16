# Architecture

## High-level diagram

```text
Browser
  -> Express app (routes -> controllers -> db.js)
      -> MongoDB (flights, users, bookings, reviews)
```

## Folder map

```text
zeroday-airways/
├── src/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── routes/
│   └── server.js
├── views/
├── public/
├── uploads/
├── seeds/
├── docs/
├── .github/
└── docker-compose.yml
```

## Request lifecycle for POST /bookings

1. The browser posts to `/bookings` with a flight ID and passenger details.
2. Express parses the form body and calls the bookings controller.
3. The controller reads the current session and creates a booking document.
4. The controller inserts the booking into the `bookings` collection.
5. The app redirects to the booking detail route for the created record.

## Docker topology

```text
Host machine
  -> docker compose up
      -> app container (Node.js + Express)
      -> mongo container (MongoDB 6)
```

The app listens on `127.0.0.1:3000`, and MongoDB is exposed only on `127.0.0.1:27017`.

## Where each vulnerability lives

| File | VULN-ID |
| --- | --- |
| `src/controllers/auth.controller.js` | VULN-01, VULN-05 |
| `src/controllers/reviews.controller.js` | VULN-02 |
| `src/controllers/flights.controller.js` | VULN-03 |
| `src/controllers/bookings.controller.js` | VULN-04, VULN-08 |
| `src/controllers/avatar.controller.js` | VULN-06, VULN-10 |
| `src/controllers/boardingpass.controller.js` | VULN-07 |
| `src/controllers/admin.controller.js` | VULN-09 |
| `src/server.js` | VULN-09 |
| `views/flight.ejs` | VULN-02 |
| `views/search.ejs` | VULN-03 |
