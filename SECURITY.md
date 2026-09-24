# Security

Ssaaxcy handles customer contact data and potentially sensitive documents.

## Rules

- Never commit `.env`, production databases, uploaded customer files, API keys, SMTP passwords, or TOTP secrets.
- Production secrets belong in environment variables or an external secret manager.
- Public API responses must use explicit allow-lists. Never serialize the full settings table.
- Customer request status and file downloads require a high-entropy access token.
- Uploaded files are stored under generated names outside the public web root and are validated by file signature.
- Admin access uses a strong password, CSRF protection, rate limiting and TOTP 2FA in production.
- If a credential may have been exposed, rotate it after the patched version is deployed.

## Deployment

Persist both the SQLite database and `data/uploads` on production storage. Back them up together.
