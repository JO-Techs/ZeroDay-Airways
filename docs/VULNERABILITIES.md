# Vulnerability index

| VULN-ID | Name | OWASP 2021 | Feature | Owner | Branch | Status |
| --- | --- | --- | --- | --- | --- | --- |
| VULN-01 | NoSQL Injection | A03:2021 | Login | Alna | `feature/VULN-01-nosqli` | Not started |
| VULN-02 | Stored XSS | A03:2021 | Flight reviews | Abin | `feature/VULN-02-stored-xss` | Not started |
| VULN-03 | Reflected XSS | A03:2021 | Flight search | Abin | `feature/VULN-03-reflected-xss` | Not started |
| VULN-04 | IDOR / Broken Access Control | A01:2021 | Booking view and cancel | Alna | `feature/VULN-04-idor` | Not started |
| VULN-05 | Weak Auth / Brute Force | A07:2021 | Login | Alna | `feature/VULN-05-weak-auth` | Not started |
| VULN-06 | Unrestricted File Upload | A05:2021 | Avatar upload | Abin | `feature/VULN-06-upload` | Not started |
| VULN-07 | Path Traversal | A01:2021 | Boarding-pass download | Abin | `feature/VULN-07-path-traversal` | Not started |
| VULN-08 | CSRF | A01:2021 | Cancel booking + change email | Alna | `feature/VULN-08-csrf` | Not started |
| VULN-09 | Security Misconfiguration | A05:2021 | Admin debug + app config | Joel | `feature/VULN-09-misconfig` | Not started |
| VULN-10 | SSRF | A10:2021 | Server-side request forgery | Joel | `feature/VULN-10-ssrf` | Not started |

## VULN-01 — NoSQL Injection
**OWASP 2021:** A03:2021 – Injection  
**Feature:** Login  
**Owner:** Alna  
**Branch:** `feature/VULN-01-nosqli`  
**Status:** Not started

### Description
The login flow builds a MongoDB query directly from untrusted request data. Because the app does not validate or normalize the input, an attacker can submit a crafted object that bypasses normal credential checks.

### Vulnerable code
```js
const user = await users.findOne({
  username: req.body.username,
  password: req.body.password
});
```

### Exploitation / PoC
1. Send a POST request to `/auth/login` with `{"username":{"$ne":null},"password":{"$ne":null}}`.
2. Observe that the request succeeds without a valid username or password.
3. Screenshot to record the successful login state.

### Remediation
Use explicit username lookup, validate the input type, and compare the provided password against a salted hash instead of raw values. Use a strict query object and a managed authentication layer.

```js
const username = String(req.body.username || '').trim();
const password = String(req.body.password || '');
const user = await users.findOne({ username });
if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
  return res.render('login', { error: 'Invalid credentials' });
}
```

### References
- https://owasp.org/Top10/A03_2021-Injection/

## VULN-02 — Stored XSS
**OWASP 2021:** A03:2021 – Injection  
**Feature:** Flight reviews  
**Owner:** Abin  
**Branch:** `feature/VULN-02-stored-xss`  
**Status:** Not started

### Description
The review body is stored exactly as submitted and later rendered in a flight details page without sanitization. This allows an attacker to permanently inject JavaScript into the application.

### Vulnerable code
```js
await reviews.insertOne({
  flightId,
  userId: req.session.userId,
  username: req.session.user,
  rating,
  body: req.body.body,
  createdAt: new Date()
});
```

### Exploitation / PoC
1. Log in as any user.
2. Submit a review with a payload such as `<script>fetch('/admin/debug')</script>`.
3. Visit the flight page and confirm the script executes when the page renders.

### Remediation
Sanitize review content before storing it, and render all user-generated content with escaping in the view layer. Consider a safe HTML sanitizer or markdown renderer with strict allowed tags.

```js
const safeBody = sanitizeHtml(req.body.body, { allowedTags: [], allowedAttributes: {} });
await reviews.insertOne({ ... , body: safeBody });
```

### References
- https://owasp.org/Top10/A03_2021-Injection/

## VULN-03 — Reflected XSS
**OWASP 2021:** A03:2021 – Injection  
**Feature:** Flight search  
**Owner:** Abin  
**Branch:** `feature/VULN-03-reflected-xss`  
**Status:** Not started

### Description
The flight search controller reflects raw query parameters into the results page. An attacker can craft a malicious script in the URL and cause the browser to execute it.

### Vulnerable code
```js
const origin = req.query.from || '';
const destination = req.query.to || '';
res.render('search', { flights, q: req.query });
```

### Exploitation / PoC
1. Request `/search?from=<script>alert(1)</script>&to=LHR`.
2. Observe the unescaped payload in the page output.
3. Record the reflected script execution in a screenshot.

### Remediation
Never render raw user-controlled values without escaping. Validate the query input and render only safe, expected formats.

```js
const from = String(req.query.from || '').trim();
const to = String(req.query.to || '').trim();
res.render('search', { flights, q: { from: escapeHtml(from), to: escapeHtml(to) } });
```

### References
- https://owasp.org/Top10/A03_2021-Injection/

## VULN-04 — IDOR / Broken Access Control
**OWASP 2021:** A01:2021 – Broken Access Control  
**Feature:** Booking view and cancel  
**Owner:** Alna  
**Branch:** `feature/VULN-04-idor`  
**Status:** Not started

### Description
The booking endpoints trust the URL parameter without checking whether the logged-in user owns that booking. This allows a user to access or cancel another guest's itinerary.

### Vulnerable code
```js
const booking = await bookings.findOne({ _id: new ObjectId(req.params.id) });
await bookings.updateOne({ _id }, { $set: { status: 'cancelled' } });
```

### Exploitation / PoC
1. Log in as a legitimate user.
2. Change the booking ID in the URL or form action to an ID belonging to someone else.
3. Confirm the app loads or cancels the other booking.

### Remediation
Always enforce ownership checks on every booking read and mutation. Restrict updates to the current authenticated user and verify IDs server-side.

```js
const booking = await bookings.findOne({ _id: new ObjectId(id), userId: req.session.userId });
if (!booking) return res.status(403).send('Forbidden');
```

### References
- https://owasp.org/Top10/A01_2021-Broken_Access_Control/

## VULN-05 — Weak Auth / Brute Force
**OWASP 2021:** A07:2021 – Identification and Authentication Failures  
**Feature:** Login  
**Owner:** Alna  
**Branch:** `feature/VULN-05-weak-auth`  
**Status:** Not started

### Description
The app keeps user passwords in plaintext and accepts credentials without any rate-limiting or lockout protection. Attackers can brute force or dictionary attack accounts with little resistance.

### Vulnerable code
```js
await users.insertOne({
  username,
  email,
  password,
  role: 'user',
  loyaltyTier: 'Silver',
  miles: 0,
  avatarUrl: '',
  createdAt: new Date()
});
```

### Exploitation / PoC
1. Run a dictionary attack or Hydra/FFuf against `/auth/login`.
2. Confirm the app accepts common credentials and does not lock the account.
3. Inspect the database to see plaintext passwords stored in the `users` collection.

### Remediation
Use strong password hashing, rate limiting, and lockout thresholds. Add login throttling and reject repeated failed attempts.

```js
const result = await bcrypt.compare(password, user.passwordHash);
if (result) { ... }
```

### References
- https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/

## VULN-06 — Unrestricted File Upload
**OWASP 2021:** A05:2021 – Security Misconfiguration  
**Feature:** Avatar upload  
**Owner:** Abin  
**Branch:** `feature/VULN-06-upload`  
**Status:** Not started

### Description
The avatar upload endpoint stores files to disk without validating MIME type or extension. An attacker can upload SVG, HTML, or JavaScript content and turn the upload path into an executable web resource.

### Vulnerable code
```js
const filename = Date.now() + '-' + file.originalname;
await users.updateOne({ _id }, { $set: { avatarUrl: '/uploads/avatars/' + filename } });
```

### Exploitation / PoC
1. Upload an `avatar.html` or malicious SVG file.
2. Navigate to `/uploads/avatars/<filename>`.
3. Confirm the browser executes script content or reveals the HTML payload.

### Remediation
Validate file extension, MIME type, and file contents before storage. Store uploads outside the web root or serve them through a signed, restricted path.

```js
if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype)) {
  return res.status(400).send('Unsupported file type');
}
```

### References
- https://owasp.org/Top10/A05_2021-Security_Misconfiguration/

## VULN-07 — Path Traversal
**OWASP 2021:** A01:2021 – Broken Access Control  
**Feature:** Boarding-pass download  
**Owner:** Abin  
**Branch:** `feature/VULN-07-path-traversal`  
**Status:** Not started

### Description
The boarding-pass download route builds a file path directly from a query parameter, allowing attackers to escape the intended uploads directory and read arbitrary files from the server.

### Vulnerable code
```js
const fileName = req.query.file;
const fullPath = path.join(__dirname, '..', '..', 'uploads', 'boarding-passes', fileName);
res.download(fullPath);
```

### Exploitation / PoC
1. Request `/boarding-pass?file=../../src/config/db.js`.
2. Confirm the server downloads the app source or a sensitive local file.
3. Try a filesystem path such as `/etc/passwd` in a similar fashion.

### Remediation
Restrict file names to a safe allowlist and join them only under the intended upload root with validation against path traversal patterns.

```js
const safe = path.basename(fileName);
const finalPath = path.resolve(uploadDir, safe);
if (!finalPath.startsWith(uploadDir)) throw new Error('Invalid path');
```

### References
- https://owasp.org/Top10/A01_2021-Broken_Access_Control/

## VULN-08 — CSRF
**OWASP 2021:** A01:2021 – Broken Access Control  
**Feature:** Cancel booking + change email  
**Owner:** Alna  
**Branch:** `feature/VULN-08-csrf`  
**Status:** Not started

### Description
The booking cancellation and profile update routes accept POST requests without a CSRF token and without verifying the origin. A malicious site can trigger authenticated actions on behalf of the victim.

### Vulnerable code
```js
await bookings.updateOne({ _id }, { $set: { status: 'cancelled' } });
await users.updateOne({ _id }, { $set: { email, username } });
```

### Exploitation / PoC
1. Craft a hidden HTML form that submits a POST to `/bookings/<id>/cancel`.
2. Include the form on an attacker site and lure a victim to it while logged in.
3. Confirm the user’s booking is cancelled without consent.

### Remediation
Use anti-CSRF tokens, same-site cookie rules, and origin verification on state-changing requests.

```js
app.use(csrf({ cookie: true }));
```

### References
- https://owasp.org/Top10/A01_2021-Broken_Access_Control/

## VULN-09 — Security Misconfiguration
**OWASP 2021:** A05:2021 – Security Misconfiguration  
**Feature:** Admin debug + application config  
**Owner:** Joel  
**Branch:** `feature/VULN-09-misconfig`  
**Status:** Not started

### Description
The admin debug endpoint is public, exposes sensitive configuration values, and prints full stack traces on errors. The app also runs without standard secure HTTP headers or protections in place.

### Vulnerable code
```js
res.json({ env: process.env, session: req.session, headers: req.headers });
```

### Exploitation / PoC
1. Visit `/admin/debug` without authenticating.
2. Confirm that environment variables, session IDs, and request headers are revealed directly in the browser.
3. Trigger an error and inspect the full stack trace visible to the user.

### Remediation
Require authentication for debug endpoints, strip sensitive fields from responses, and configure secure headers such as `Content-Security-Policy`, `X-Frame-Options`, and `Strict-Transport-Security`.

```js
app.use(helmet());
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});
```

### References
- https://owasp.org/Top10/A05_2021-Security_Misconfiguration/

## VULN-10 — SSRF
**OWASP 2021:** A10:2021 – Server-Side Request Forgery  
**Feature:** Avatar import from URL  
**Owner:** Joel  
**Branch:** `feature/VULN-10-ssrf`  
**Status:** Not started

### Description
The avatar import route fetches any remote URL provided by the user. Because it has no allowlist, protocol validation, or network restrictions, it can reach internal services and metadata endpoints from the server.

### Vulnerable code
```js
const response = await axios.get(req.body.url);
const filename = 'imported-' + Date.now() + '.img';
fs.writeFileSync(path.join(uploadDir, filename), response.data);
```

### Exploitation / PoC
1. POST `/avatar/import` with `url=http://mongo:27017` or `http://169.254.169.254/latest/meta-data/`.
2. Observe that the server fetches and stores the response content.
3. Capture the result in a screenshot.

### Remediation
Block non-HTTP requests, restrict allowed hosts, and deny private or metadata IP ranges. Prefer a fixed allowlist of safe domains and validate the final URL before fetching it.

```js
if (!/^https:\/\//.test(url) || !allowedHosts.has(new URL(url).hostname)) {
  return res.status(400).send('URL not allowed');
}
```

### References
- https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/
