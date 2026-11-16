# Task split and milestones

## Ownership matrix

| Owner | Scope |
| --- | --- |
| Joel | Scaffold, Docker, GitHub files, docs, VULN-09, VULN-10 |
| Alna | VULN-01, VULN-04, VULN-05, VULN-08 |
| Abin | VULN-02, VULN-03, VULN-06, VULN-07 |

## Milestones

- M1 (Week 1): Repo up, Docker runs, seed works, all views render — Joel
- M2 (Week 2): VULN-01, 04, 05, 08 implemented + PoC — Alna
- M3 (Week 2): VULN-02, 03, 06, 07 implemented + PoC — Abin
- M4 (Week 3): VULN-09, 10 + integration testing — Joel
- M5 (Week 3): PoCs + remediations in VULNERABILITIES.md — All
- M6 (Week 4): Final report + demo rehearsal — Joel leads

## Definition of done per vulnerability

- Vulnerable code is present as described in `docs/VULNERABILITIES.md`.
- The feature is visible and reachable from the local app.
- A PoC or reproduction path exists and is recorded in the issue and PR.
- Remediation notes are documented in the vulnerability file.
- Screenshot evidence exists under `docs/screenshots/`.

## PR review rotation

- Joel reviews each PR.
- One additional teammate reviewer is required for merge.
- Any shared file is coordinated through the `dev` branch.
