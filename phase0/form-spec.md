# RouteMate Google Form — FINAL BUILD SPEC (publish this exactly)

Build in this exact question order — the Sheet formulas map to columns A–Q.
One linear flow, 3 sections, NO branching logic (branching risks column
reordering and adds build time for zero completion gain).

**Form title:** `RouteMate – Sanskriti Commute Match (60 seconds)`

**Form description:**
> Hundreds of Sanskriti students travel the same routes daily without knowing
> each other. RouteMate matches you with a verified student from your area,
> your timing, your college — so you stop paying ₹100+/day or riding alone.
> Students only. Roll-number verified. No charges.
> We'll WhatsApp you your match this month.
> — Vamshi, final year AI&ML, Sanskriti University · Instagram: @routemate.app

Settings: do NOT require sign-in to a Google account (kills completion on
phones with school accounts). Do not collect email addresses automatically.
Limit to 1 response: OFF (no sign-in means it can't be enforced anyway).

---

## Section 1 — About you

| # | Question | Type | Required | Options / notes |
|---|----------|------|----------|-----------------|
| 1 | Full name | Short answer | ✅ | |
| 2 | Roll number | Short answer | ✅ | Description under question: "Only to verify you're a Sanskriti student. Never shown to anyone." |
| 3 | Year & branch | Dropdown | ✅ | 1st yr CSE, 1st yr AI&ML, 1st yr ECE, 1st yr MECH, 1st yr CIVIL, 1st yr other… repeat for 2nd/3rd/4th. (Trim to Sanskriti's real branch list before publishing.) |
| 4 | Gender | Multiple choice | ✅ | Male / Female / Prefer not to say. Description: "Used only for same-gender match preference." |
| 5 | WhatsApp number | Short answer | ✅ | Description: "Only used to send you your match. Never public, never shared without your yes." |

## Section 2 — Your daily commute

| # | Question | Type | Required | Options / notes |
|---|----------|------|----------|-----------------|
| 6 | Which area do you travel from? | Dropdown | ✅ | Kukatpally / Miyapur / Nizampet / Bachupally / KPHB / JNTU / Kondapur / Gachibowli / Madhapur / Ameerpet / ECIL / Uppal / LB Nagar / Dilsukhnagar / Secunderabad / Other. **Confirm this list with 5 friends BEFORE publishing — replace with Sanskriti's real catchment.** |
| 7 | Nearest landmark / stop | Short answer | ⬜ | |
| 8 | What time do you usually reach college? | Multiple choice | ✅ | Before 8:30 AM / 8:30–9:00 / 9:00–9:30 / 9:30–10:00 / Varies daily |
| 9 | What time do you usually leave college? | Multiple choice | ✅ | Before 3:30 PM / 3:30–4:30 / 4:30–5:30 / After 5:30 / Varies |
| 10 | How do you commute NOW? | Multiple choice | ✅ | College bus / Own bike or scooty / Auto or Rapido-Uber / Metro + auto / Parent drops me / Other |
| 11 | If auto/Rapido: what do you spend per day (both ways)? | Multiple choice | ✅ | Under ₹60 / ₹60–100 / ₹100–150 / ₹150+ / Not applicable |
| 12 | Do you ride a vehicle to college? | Multiple choice | ✅ | Bike / Scooty / Car / No vehicle |

## Section 3 — Matching

| # | Question | Type | Required | Options / notes |
|---|----------|------|----------|-----------------|
| 13 | If you HAVE a vehicle: would you let a verified Sanskriti student from your area ride along on your regular route? | Multiple choice | ✅ | Yes / Yes, if petrol is shared / Only same gender / No / **Not applicable – I don't have a vehicle** |
| 14 | If you DON'T have a vehicle: would you commute daily with a verified Sanskriti student — bike ride-along or splitting an auto? | Multiple choice | ✅ | Yes / Only same gender / Maybe, need details / No / **Not applicable – I have a vehicle** |
| 15 | What would worry you most about sharing a daily commute? | Checkboxes | ⬜ | Safety with someone I don't know / Awkwardness / Depending on someone's punctuality / My parents' permission / Nothing really / Other |
| 16 | We're matching students by hand this month. Can we WhatsApp you a match this week? | Multiple choice | ✅ | Yes, match me / Not yet, just curious |

**Confirmation message after submit:**
> Done ✅ If there's a Sanskriti student on your route, you'll hear from us on
> WhatsApp this week. Want your friends matched too? Share the form with your
> area's group.

---

## Pre-publish checklist

- [ ] Area dropdown confirmed with 5 friends (the #1 thing to get right)
- [ ] Branch list matches Sanskriti's actual branches
- [ ] Instagram handle @routemate.app (or whatever you registered) live with 1 post, linked in description
- [ ] Test submission done → lands in Sheet columns A–Q correctly → Dashboard counts it → test row deleted
- [ ] Form link shortened (forms.gle short link is fine)
