# RideMatch — Design System MASTER (Source of Truth)

> Status: **LOCKED v1.0** — implemented in `src/theme/theme.js` (single source of truth for tokens).
> This file is the retrieval summary; when values conflict, `theme.js` wins.
> Do NOT adopt auto-generated palettes (e.g. rose/Nunito suggestions) — the system below is deliberate.

## Product Context
Peer-to-peer ride-share matchmaking for Indian college students (Hyderabad). Not a cab app.
Zero payments, zero commission. Core metric: Weekly Active Ride Pairs.
Platform: React Native (Expo SDK 54, Expo Go compatible), Android first at 390px width.

## Colors (semantic)
| Token | Hex | Use |
|---|---|---|
| Primary | `#1A73E8` | System/nav actions: Next, Save, Verify, Apply Filters |
| Accent | `#FF6B35` | Social/connection actions: Send Interest, Accept, Connect |
| Surface | `#F7F9FC` | Screen background |
| Dark | `#0F172A` | Dark surface / primary text base |
| Success | `#16A34A` | Reliability high, accept confirmations |
| Warning | `#F59E0B` | Reliability mid |
| Error | `#DC2626` | Destructive, reliability low |

**CTA Color Rule (NON-NEGOTIABLE):** Orange = social. Blue = system. Never swap.

## Typography
- Display: **Space Grotesk** (headings, greeting, numbers that need personality)
- Body: **Inter** (everything else)
- Minimums: 14px body, 12px captions (WCAG AA). `micro` (10px) only for badges/counts, never sentences.
- Use `theme.typography.*` roles (h1–h3, body1/2, caption, chipText, buttonText…) — never raw fontSize in components.

## Shape & Space
- Radius: 16 cards / 12 inputs / 8 chips / 24 buttons / 9999 pills
- Spacing: 8px base grid, tokens `spacing.s4`–`s96`
- Icons: **Phosphor** (`phosphor-react-native`) only — one family, no emoji as icons
- Touch targets ≥ 44×44dp (use `hitSlop` when the glyph is smaller)

## Every Screen Must Have
1. Loading state (skeleton/shimmer, not blocking spinner)
2. Error state with retry
3. Empty state with a next action
4. Safe-area handling via `react-native-safe-area-context` (`useSafeAreaInsets`) — never hardcoded top padding
5. `accessibilityLabel` + `accessibilityRole` on every icon-only or non-text control

## Coding Rules
1. All style values from `theme.js` tokens — zero hardcoded colors/sizes/font names in components
2. `import { theme } from '../theme/theme'`
3. `npx expo install` only; Expo SDK 54 packages only
4. Mock data uses Hyderabad names: Kukatpally, Miyapur, Gachibowli, JNTU, Sanskriti University, Madhapur, Kondapur
5. Memoize FlatList items (`React.memo`) and keep `renderItem` stable

## Canonical Data Encodings
- Days of week: `'M' | 'T' | 'W' | 'Th' | 'F' | 'S'` (Thursday is `'Th'` — never a second `'T'`)
- Connection states: `default → interest_sent → interest_received → connected`

## MVP Guardrails (do not build)
Live GPS, payments/UPI, driver/rider roles, admin dashboard, scheduling calendar,
group rides, AI route suggestions, web version. Show disabled "Coming soon" if unavoidable.

## Page Overrides
Check `design-system/pages/<page-name>.md` before building a screen; if present, it overrides this file.
