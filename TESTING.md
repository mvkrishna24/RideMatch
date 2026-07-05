# RouteMatch — Testing Guide

How to run the full stack locally and walk the complete product loop.

## Prerequisites (one-time)

| Item | Where | Status check |
|---|---|---|
| Email/Password auth enabled | Firebase console → Authentication → Sign-in method | Sign-up in app works |
| Firestore database created (asia-south1) + `firestore.rules` published | Firebase console → Firestore | Chat sends messages |
| Admin SDK key | Firebase console → Project settings → Service accounts → Generate key → save as `~/routemate-sa.json` (NEVER in the repo) | Backend log says "Firebase Admin SDK initialized" |
| Docker Desktop running | — | `docker info` succeeds |

## Run the backend

```bash
cd routemate-api
docker compose up -d                                   # Postgres on :5433
export GOOGLE_APPLICATION_CREDENTIALS=~/routemate-sa.json
./mvnw spring-boot:run
curl localhost:8080/health                             # {"status":"ok"}
```

## Deploy Firestore rules (single source of truth)

The repo's `firestore.rules` is the ONLY valid ruleset. Never hand-edit rules
in the Firebase console — drift here already broke chat once (2026-07-06:
console rules denied legitimate room creation AND allowed non-members to post
messages). To deploy:

```bash
npm run rules:print     # prints the exact rules to copy
```

Firebase console → Firestore Database → Rules → **select all → delete →
paste → Publish**. Full replacement every time; never merge by hand.

## Run the app

```bash
npx expo start          # phone on the SAME Wi-Fi as this machine
```

The app auto-discovers the backend through Metro's LAN address — no IP
configuration needed in development.

If phone and laptop cannot share Wi-Fi (hostel networks, AP isolation), use a
tunnel — `@expo/ngrok` is already a project dependency:

```bash
npx expo start --tunnel --clear
```

Note: tunnel mode changes Metro's host, so backend auto-discovery stops
working — the app will fall back to localhost. For tunnel sessions, point the
app at your machine explicitly before starting:

```bash
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:8080 npx expo start --tunnel --clear
```

## API URL — how the app finds the backend

| Situation | URL source | Action needed |
|---|---|---|
| Dev, same Wi-Fi | Auto-derived from Metro's LAN host | none |
| Dev, tunnel | `EXPO_PUBLIC_API_URL` env when starting Expo | set it (above) |
| Preview / production APK | `EXPO_PUBLIC_API_URL` in `eas.json` build profile | replace the placeholder with the deployed backend URL **before building** |

Never hardcode a LAN IP in source — IPs change with the router's mood.

## Create test accounts

Real accounts, fake students — use `+` aliases of your own email so you
receive nothing but can create many: `you+testa@gmail.com`, `you+testb@gmail.com`.

Fastest two-user test: your phone (User A) + a second device or emulator
(User B). Emulator: `npx expo start` then press `a` with Android Studio's
emulator running.

## Verify users (manual, founder-only)

New accounts are PENDING and see the verification gate. To verify:

```bash
docker exec -it routemate-postgres psql -U routemate -d routemate \
  -c "UPDATE users SET verification_status='VERIFIED' WHERE email='you+testa@gmail.com';"
```

Pull-to-refresh the feed after verifying. To see extra students in the feed,
seed three fake verified profiles: `psql ... < dev-seed.sql` (dev only).

## The full loop — pass criteria

1. **A signs up** → verification-pending screen → completes profile → feed shows "Verification in review" gate
2. **Verify A via SQL** → refresh → matches appear (seeded users or B)
3. **B signs up, completes profile, gets verified**
4. **A sees B** in feed with a match score; **A taps Send Interest** → card flips to "Interest Sent ✓" and stays flipped after app restart
5. **B sees A** at the top of the feed with "They want to ride with you →" → taps **Accept**
6. Both see each other in **Chats**; messages deliver both ways; the amber safety banner is pinned in every thread
7. **Block test**: B blocks A from the chat header shield → chat closes, A vanishes from B's chats & matches, A can no longer find B, A gets "Student not found" on any new interest
8. **Report test**: report from the shield menu → row appears: `SELECT * FROM reports;`
9. **Restart & relogin**: kill app → reopen → still signed in, straight to feed. Sign out → sign in → same profile, same connections.

## Useful inspection queries

```sql
SELECT email, verification_status FROM users;
SELECT s.email AS sender, r.email AS receiver, i.status
  FROM interests i JOIN users s ON s.id=i.sender_id JOIN users r ON r.id=i.receiver_id;
SELECT * FROM connections; SELECT * FROM reports; SELECT * FROM blocks;
```
