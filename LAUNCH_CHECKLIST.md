# RouteMatch — Launch Checklist

What must be TRUE before any JNTUH student who isn't a friend installs this.
Owner for every item: Vamshi. Status legend: ☐ open · ✅ done.

## 1. Infrastructure (blockers — app does not function without these)

- ☐ Firebase Authentication: Email/Password enabled *(2 clicks — still off as of 2026-07-05)*
- ☐ Firestore database created in `asia-south1` + `firestore.rules` published
- ☐ Admin SDK service-account key generated; local dev uses `GOOGLE_APPLICATION_CREDENTIALS`
- ☐ Backend deployed (Railway): Postgres + `FIREBASE_SERVICE_ACCOUNT` env + `SPRING_PROFILES_ACTIVE=production`
- ☐ `eas.json` preview profile `EXPO_PUBLIC_API_URL` points at the deployed backend (LAN discovery only works in dev)
- ☐ Full loop passes on two physical phones per TESTING.md

## 2. App identity

- ☐ Real app icon (1024×1024 + Android adaptive foreground/monochrome) — assets/images still contain Expo defaults
- ☐ Splash screen image replaced
- ✅ Display name RouteMatch, package `com.routemate.app`

## 3. Trust & safety (non-negotiable before strangers meet strangers)

- ✅ Verification gate: PENDING users see and are seen by no one
- ✅ Same-gender preference enforced both directions, at the backend
- ✅ Block: severs connection + interests + visibility; undetectable to the blocked
- ✅ Report: persisted; **founder commits to reviewing within 24h — put a daily reminder in your phone**
- ✅ No contact info exposed pre-connection; chat unlocks only after mutual consent
- ✅ Pinned safety message in every chat; no fake ratings anywhere
- ☐ A written verification procedure: what proof = VERIFIED (roll number photo? student ID? decide and write it down)
- ☐ Your moderation plan: who gets suspended, after what, decided by whom (you)

## 4. Operations

- ☐ Play Console account ($25) — needed even for internal testing track
- ☐ EAS account + `eas login` on this machine
- ☐ First internal build: `npx eas build --profile preview --platform android`
- ☐ Privacy policy page (required for Play data-safety form; emergency contact + gender = personal data)
- ☐ Daily founder ritual live: check reports table, verify new signups, update pair tracker

## 5. The only metric

- ☐ 20–50 testers recruited **in person** at JNTUH — WhatsApp groups, CRs, canteen
- ☐ Phase 0 spreadsheet repointed at JNTUH and tracking: signups → verified → matched → connected → **weekly active ride pairs**
- ☐ First real ride pair confirmed (two students, one bike/auto, campus gate)

Ship gate: **sections 1–3 complete = friends can install. Section 4 complete =
strangers can install. Section 5 is why any of it exists.**
