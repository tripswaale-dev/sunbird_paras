# Admin Authentication Notes — Phase 4B

Token-based admin authentication for the Sunbird Vacations API. Frontend (`../frontend/`) was **not modified**.

## Architecture

```
POST /api/admin/login  →  validate credentials  →  Sanctum token
GET  /api/admin/me     →  auth:sanctum + admin middleware
POST /api/admin/logout →  auth:sanctum + admin middleware  →  revoke token
```

- **Package:** Laravel Sanctum 3.x (already installed in Phase 1)
- **Model:** Existing `users` table with `is_admin` boolean (default `false`)
- **Auth type:** Bearer token (not SPA cookie sessions)
- **Future:** Protected `/api/admin/*` CRUD routes will use the same middleware stack

## Sanctum Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| `HasApiTokens` | On `User` model | Pre-existing |
| `EnsureFrontendRequestsAreStateful` | Commented out in Kernel | Correct for token API |
| `sanctum.expiration` | `null` | Tokens do not auto-expire yet |
| `personal_access_tokens` table | Exists | Standard Sanctum migration |

No Sanctum config file changes were required beyond verification.

## User / Admin Structure

The existing `users` table and `User` model are reused. No separate admin table.

| Field | Purpose |
|-------|---------|
| `is_admin` | Boolean, default `false`. **Not** in `$fillable` (mass-assignment protection) |
| `isAdmin()` | Helper method on User model |

Admin privileges are set via seeder or direct DB assignment only.

## Endpoints

| Method | URL | Auth | Purpose |
|--------|-----|------|---------|
| POST | `/api/admin/login` | Public (rate-limited: 5/min/IP) | Issue Sanctum token |
| GET | `/api/admin/me` | Bearer + admin | Current admin profile |
| POST | `/api/admin/logout` | Bearer + admin | Revoke current token |

### Login Request

```json
{ "email": "admin@sunbird.local", "password": "your-password" }
```

### Login Success

```json
{
  "success": true,
  "data": {
    "token": "1|...",
    "user": { "id": 1, "name": "Sunbird Admin", "email": "admin@sunbird.local" }
  }
}
```

### Authenticated Requests

```
Authorization: Bearer {token}
```

## Error Responses

| Case | Status | Message |
|------|--------|---------|
| Invalid credentials | 401 | `"Invalid credentials."` |
| Valid user, not admin | 403 | `"You are not authorized to access the admin area."` |
| Unauthenticated | 401 | `"Unauthenticated."` |
| Authenticated, not admin | 403 | `"Forbidden."` |
| Validation failure | 422 | Phase 4A format with `errors` |

## Development Admin Account

Set in `.env` before seeding:

```env
ADMIN_NAME="Sunbird Admin"
ADMIN_EMAIL=admin@sunbird.local
ADMIN_PASSWORD=your-dev-password
```

Then:

```bash
php artisan db:seed --class=AdminSeeder
# or
php artisan db:seed
```

`AdminSeeder` skips silently if `ADMIN_EMAIL` or `ADMIN_PASSWORD` is not set.

**Never commit real passwords.** Use strong unique passwords in production.

## Security Measures

- Passwords hashed with Laravel `Hash` (bcrypt)
- `is_admin` excluded from `$fillable`
- Generic login error messages (no account enumeration)
- Login rate limited to 5 attempts/minute per IP
- Token revoked on logout (deleted from `personal_access_tokens`)
- Admin middleware enforces backend authorization
- Sensitive fields (`password`, `remember_token`) never in JSON responses
- API errors return JSON, not HTML redirects

## Known Limitations (future phases)

- No token expiration configured (`sanctum.expiration` is null)
- No refresh token flow
- No password reset for admin
- No role/permission system beyond `is_admin`
- No multi-factor authentication

## Testing

```bash
php artisan test --filter=Api
```

26 tests (11 admin auth + 15 Phase 4A public API).
