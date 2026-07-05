# routemate-api

RouteMatch backend — Spring Boot 3.5 modular monolith. Owns profiles, commute
data, matching (Phase 3), connections, and safety. Firebase owns identity.

## Run locally

```bash
docker compose up -d          # Postgres on localhost:5433
./mvnw spring-boot:run        # boots with the 'local' profile
curl localhost:8080/health    # → {"status":"ok"}
```

## Firebase Admin credentials

Token verification needs a service account:

1. Firebase console → Project settings → Service accounts →
   **Generate new private key** (downloads a JSON file).
2. NEVER commit that file. It is already covered by .gitignore
   (`*-service-account.json`).
3. Locally: `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json`
   before `./mvnw spring-boot:run`.
4. Production (Railway): paste the JSON into a `FIREBASE_SERVICE_ACCOUNT`
   environment variable.

Without credentials the app boots, `/health` works, but every authenticated
request returns 401 with a log line explaining why.

## API surface (Phase 2C)

| Method | Path            | Auth | Purpose                              |
|--------|-----------------|------|--------------------------------------|
| GET    | /health         | none | liveness                             |
| POST   | /api/auth/sync  | ✅   | find-or-create local user, return standing |
| GET    | /api/me         | ✅   | current user + commute profile       |
| PUT    | /api/me         | ✅   | update identity fields               |
| PUT    | /api/commute    | ✅   | upsert commute profile               |

Auth = `Authorization: Bearer <firebase id token>` on every request.

## Tests

```bash
./mvnw test    # unit + context tests, in-memory H2, no credentials needed
```
