# routemate-api — Railway Deployment

One backend service + one Postgres, both on Railway. ~20 minutes first time.

## 1. Create the project

1. railway.app → **New Project** → **Deploy from GitHub repo** → select this
   repo. (Push to GitHub first if you haven't.)
2. In the service settings → **Root Directory**: `routemate-api`
   (monorepo — Railway must build from this folder; it will find the
   Dockerfile automatically).

## 2. Add Postgres

**+ New → Database → PostgreSQL.** Nothing else to configure — Railway
provisions it and exposes connection variables.

## 3. Environment variables (on the API service, not the database)

| Variable | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `production` (already set by the Dockerfile; setting it again is harmless) |
| `PGHOST` | `${{Postgres.PGHOST}}` |
| `PGPORT` | `${{Postgres.PGPORT}}` |
| `PGDATABASE` | `${{Postgres.PGDATABASE}}` |
| `PGUSER` | `${{Postgres.PGUSER}}` |
| `PGPASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `FIREBASE_SERVICE_ACCOUNT` | Paste the ENTIRE service-account JSON as the value (Railway → Raw Editor handles multiline). Never commit this JSON anywhere. |

The `${{Postgres.*}}` forms are Railway **reference variables** — type them
literally; Railway resolves them to the database's live values.

## 4. Health check + domain

- Service settings → **Healthcheck Path**: `/health`
- Settings → **Networking** → **Generate Domain** → you get
  `https://<something>.up.railway.app`

## 5. Verify the deploy

```bash
curl https://<your-domain>.up.railway.app/health
# → {"service":"routemate-api","status":"ok"}
```

Deploy logs must show BOTH lines:
- `Firebase Admin SDK initialized.`  (if instead you see "No Firebase
  credentials found" — the FIREBASE_SERVICE_ACCOUNT variable is missing/bad)
- `Successfully applied 1 migration` (first boot) or `is up to date`

Then an authenticated smoke test: unauthenticated `POST /api/auth/sync` must
return 401.

## 6. Point the app at it

Edit `eas.json` → `build.preview.env.EXPO_PUBLIC_API_URL` →
`https://<your-domain>.up.railway.app` — then build the preview APK.

## Verifying students in production

There is no admin UI (by design, for now). Use Railway's Postgres →
**Data/Query** tab:

```sql
UPDATE users SET verification_status='VERIFIED' WHERE email='<student email>';
```

Daily founder queries live in TESTING.md.

## Costs

Hobby plan (~$5/mo credit) covers this comfortably at tester scale: one small
JVM service + one small Postgres. Watch the usage page after week one.
