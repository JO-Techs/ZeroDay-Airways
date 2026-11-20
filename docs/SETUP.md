# Setup guide

## Prerequisites

- Docker Desktop or equivalent Docker runtime
- Node.js 20
- Git

## Clone and configure

```bash
git clone <repo>
cd zeroday-airways
cp .env.example .env
```

## Start the app and MongoDB

```bash
docker compose up -d --build
```

## Seed the database

```bash
docker compose exec app npm run seed
```

## Reset the database

```bash
docker compose down -v
```

## Reset the app

```bash
docker compose restart app
```

## Troubleshooting

### Port 3000 is in use

Stop any other service using port 3000 or edit the local port mapping in `docker-compose.yml` before running the app.

### MongoDB port 27017 is in use

If another MongoDB service is already listening on port 27017, set `MONGO_HOST_PORT=27018` in your local `.env` file and start the stack again:

```bash
docker compose up -d --build
```

The host port can be any available local port. The app and seed script connect to MongoDB over Docker's internal network, so `MONGO_URL` must remain `mongodb://mongo:27017/zeroday`.

### MongoDB healthcheck timing

If the app starts before MongoDB is ready, wait a few seconds and retry the seed command. The default seed script can be rerun safely after the database is ready.

### Uploads permission issues

Ensure the `uploads/avatars` and `uploads/boarding-passes` directories exist and are writable from the container.

### Cannot find module after pull

Rebuild the container and reinstall dependencies:

```bash
docker compose down
docker compose up -d --build
```
