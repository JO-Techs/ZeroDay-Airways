# ZeroDay Airways — Deliberately Vulnerable Flight Booking App

> [!WARNING]
> ZeroDay Airways is a deliberately insecure training application for local, educational use only. It is intentionally vulnerable and must never be deployed to a public or production environment.

ZeroDay Airways is a fictional airline booking site with 10 intentional vulnerabilities, in the spirit of OWASP Juice Shop. The app is meant to be run locally on localhost with Docker and MongoDB. It is designed for security training, demo use, and classroom walkthroughs.

## Tech stack

| Layer | Technology |
| --- | --- |
| Backend | Node.js 20 + Express 4 |
| Database | MongoDB 6 via official MongoDB driver |
| Frontend | Plain HTML + EJS templates |
| Session | express-session with MemoryStore |
| File upload | multer |
| HTTP client | axios |
| Containerization | Docker + Docker Compose |
| Package manager | npm |

## Quick Start

```bash
git clone https://github.com/JO-Techs/ZeroDay-Airways.git
cd zeroday-airways
cp .env.example .env
docker compose up -d --build
docker compose exec app npm run seed
open http://localhost:3000
```

## Default accounts

| Email | Password | Role | Tier |
| --- | --- | --- | --- |
| admin@zeroday.airways | admin123 | admin | Platinum |
| joel@zeroday.airways | password123 | user | Gold |
| alna@zeroday.airways | alna123 | user | Silver |
| abin@zeroday.airways | abin123 | user | Silver |
| eve@zeroday.airways | eve123 | user | Silver |

## Feature walkthrough

- Homepage with branded hero, booking search, and featured routes
- Search results and flight detail pages with review feed
- My bookings and booking detail pages
- User profile update screen and avatar upload/import workflow
- Admin dashboard and debug endpoint for demoing security misconfiguration
- Boarding-pass download challenge with path traversal
- Challenges scoreboard page with only challenge names and OWASP categories

> Screenshot placeholders: docs/screenshots/ will receive the PoC screenshots for each vulnerability.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/SETUP.md](docs/SETUP.md)
- [docs/TASK_SPLIT.md](docs/TASK_SPLIT.md)
- [docs/TESTING.md](docs/TESTING.md)
- [docs/VULNERABILITIES.md](docs/VULNERABILITIES.md)
- [WARNING.md](WARNING.md)

## Team

| Name | Role |
| --- | --- |
| Joel | Team lead and infrastructure |
| Alna | Authentication and access control |
| Abin | Input handling and file operations |

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
