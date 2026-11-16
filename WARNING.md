# Warning: Deliberately Insecure Training Environment

ZeroDay Airways is a deliberately insecure web application created for university coursework and security education. It contains intentionally weak authentication, broken access control, no-injection examples, file upload abuse, SSRF, and other intentionally exploitable patterns.

## Local-only usage

This application must only run on `localhost` inside Docker on a developer workstation or isolated lab environment. Do not deploy it to any public server, staging host, or cloud provider. The Docker Compose setup binds the app to `127.0.0.1` and should not be exposed beyond the local machine.

## Responsible use

- Use only for classroom instruction and authorized vulnerability testing.
- Do not connect the app to real user data, production systems, or external services.
- Do not reuse the app in production or as a template for real-world secure systems.
- Do not upload malicious content to external networks or share proof-of-concept payloads outside the training environment.

## Do not deploy

This project is intentionally insecure. Examples of what should never be done include:

- deploying it to a public VM or container host,
- exposing port 3000 to the internet,
- connecting it to real customer data,
- integrating it into a production pipeline,
- using its code as the basis for a production airline application.

## Responsible disclosure

If you identify a vulnerability in a real system, report it responsibly to the owners and follow disclosure procedures. This repository is intentionally vulnerable and is not a legitimate target outside of the controlled exercise.
