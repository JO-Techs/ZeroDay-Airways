# Contributing to ZeroDay Airways

## Branch model

This project uses a simple Git flow:

- `main` is the protected production branch.
- `dev` is the integration branch.
- Each vulnerability feature branch should follow the naming format:
  `feature/VULN-XX-<slug>`

Examples:

- `feature/VULN-01-nosqli`
- `feature/VULN-10-ssrf`

## Commit convention

Use concise commit messages that match the work being done:

- `feat(VULN-05): plaintext pw login`
- `docs(VULN-07): add PoC screenshot`
- `fix(VULN-04): add ownership checks`

## Pull request rules

- One reviewer is required.
- Joel must review every PR.
- A second reviewer from the team is also required.
- Link the VULN ID in the PR body.
- Update the status in `docs/VULNERABILITIES.md`.
- Attach the PoC screenshot in `docs/screenshots/`.

## Local run instructions

```bash
git clone <repo>
cd zeroday-airways
cp .env.example .env
docker compose up -d --build
docker compose exec app npm run seed
```

## First push commands

```bash
git init
git add .
git commit -m "feat: initialize ZeroDay Airways scaffold (VULN-01..10)"
git branch -M main
git remote add origin git@github.com:<org>/zeroday-airways.git
git push -u origin main
git checkout -b dev && git push -u origin dev
```

## Code of conduct

- Be respectful and clear in reviews.
- Keep the project intentionally educational and local-only.
- Avoid adding real security controls to the intentionally vulnerable code paths.
- Document and track each vulnerability through the vulnerability issue template.
