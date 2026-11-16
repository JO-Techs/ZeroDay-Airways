# Testing guide

## Tools

- Burp Suite Community
- Browser DevTools
- Postman
- curl

## Manual checks

### VULN-01 NoSQL injection

1. Open the login page.
2. POST JSON body to `/auth/login` with `{"username":{"$ne":null},"password":{"$ne":null}}`.
3. Confirm that a valid user is accepted.

### VULN-02 Stored XSS

1. Log in as a user and navigate to a flight detail page.
2. Submit a review with a script payload.
3. Confirm that the payload is stored and executed when the flight page loads.

### VULN-03 Reflected XSS

1. Request `/search?from=<script>alert(1)</script>&to=LHR`.
2. Confirm the payload appears unescaped in the result page.

### VULN-04 IDOR

1. Log in as one user and change the booking ID in the URL.
2. Confirm booking data for another user is shown or cancelled.

### VULN-05 Weak auth

1. Attempt a brute-force credential spray with a wordlist.
2. Confirm the app accepts clear-text credentials and has no lockout controls.

### VULN-06 Unrestricted file upload

1. Upload an HTML or SVG file as an avatar.
2. Visit the uploaded file and confirm the browser treats it as executable content.

### VULN-07 Path traversal

1. Request `/boarding-pass?file=../../src/config/db.js`.
2. Confirm the app downloads files outside the intended upload directory.

### VULN-08 CSRF

1. Create a malicious HTML form that submits a POST to `/bookings/<id>/cancel` or `/profile`.
2. Confirm no anti-CSRF token is required.

### VULN-09 Security misconfiguration

1. Request `/admin/debug` without logging in.
2. Confirm the browser dumps process.env, session data, and request headers.

### VULN-10 SSRF

1. POST `/avatar/import` with a URL such as `http://mongo:27017`.
2. Confirm the app fetches arbitrary URLs without any validation.

## Where screenshots go

PoC screenshots should live in `docs/screenshots/` and be clearly named by VULN ID.

## Pre-demo checklist

- Docker container is running
- MongoDB is seeded
- No external network access is enabled
- Browser is opened on localhost only
- Warning banner is present on every page
- README and WARNING.md are visible to the user
