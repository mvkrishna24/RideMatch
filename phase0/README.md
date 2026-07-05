# RouteMate Phase 0 — Founder Dashboard Setup (10 minutes)

One Google Sheet, six tabs. This sheet IS the backend until the app ships.

| Tab | Source | Maintained by | Purpose |
|-----|--------|---------------|---------|
| `Responses` | Form (auto) | nobody — never edit | Raw responses, source of truth |
| `Students` | `students.csv` | you | Verified student database: verification status + contact status |
| `Matching` | `matching.csv` | you | Match engine: score candidate pairs, 70+ & gender-PASS = INTRODUCE |
| `Pairs` | `pairs.csv` | you | Active ride pairs + survival tracking |
| `Learning` | `learning-log.csv` | you | Every objection/insight in their exact words |
| `Dashboard` | `dashboard.csv` | auto (formulas) | All metrics, computed |

## Setup

1. Create the Google Form exactly per `form-spec.md` (question order = column
   order A–Q; the Dashboard formulas depend on it).
2. In the Form: **Responses → Link to Sheets** → create a new spreadsheet.
3. In that spreadsheet, rename the `Form Responses 1` tab to **`Responses`**.
4. **File → Import → Upload** each CSV from this folder →
   *Insert new sheet(s)*: `dashboard.csv`, `students.csv`, `matching.csv`,
   `pairs.csv`, `learning-log.csv`.
5. Rename the imported tabs to exactly: **`Dashboard`**, **`Students`**,
   **`Matching`**, **`Pairs`**, **`Learning`**. Delete the example rows once
   real data exists.
6. Sanity-check the column mapping in `Responses` (form question order → column):

   | Col | Field | Col | Field |
   |-----|-------|-----|-------|
   | A | Timestamp | J | Leave time |
   | B | Name | K | Current commute mode |
   | C | Roll number | L | Daily spend |
   | D | Year & branch | M | Vehicle (Bike/Scooty/Car/No vehicle) |
   | E | Gender | N | Owner willingness |
   | F | WhatsApp | O | Rider willingness |
   | G | Area (dropdown) | P | Worries (checkboxes) |
   | H | Landmark | Q | "Yes, match me" commitment |
   | I | Arrive time | | |

   If a column landed elsewhere, fix the letter in the Dashboard formulas —
   don't reorder the form after it's live.
7. Submit one test response yourself and confirm the Dashboard counts it. Delete the test row after.

## Daily ritual (15 min, every evening, no exceptions)

1. New responses → copy committed ones ("Yes, match me") into **Students**,
   verify roll number (personally known / CR confirms / ID photo on WhatsApp),
   set `Verified` and `Status`.
2. Verified students → score candidate pairs in **Matching** (drag the Total
   and Verdict formulas down from row 2).
3. Introductions made / rides confirmed → update **Pairs**. `Status` is one of
   `Pending` (introduced, no ride yet), `Active`, `Dropped`.
4. Any pair with no first ride 3 days after intro → **call them**, write their
   exact words in `Drop reason` and log it in **Learning**.
5. Every objection heard in DMs/calls today → one row in **Learning**, verbatim.
6. Glance at Dashboard red flags (below).

## Nightly report (send every night, even when numbers are ugly)

```
Day N of 14
USERS — responses: X | verified: X | owners: X | no-vehicle: X | female: X
MATCHING — possible matches: X | introduced: X | first rides: X | ACTIVE PAIRS: X
LEARNING — biggest objection: "..." (verbatim)
           unexpected behavior: ...
           safety concern raised: ...
Blocker I'm avoiding: ...
```

## Red flags — tell your advisor immediately if:

- **Commit rate < 40%** ("Yes, match me" ÷ total) → messaging attracts the
  curious, not the committed. Fix the pitch, not the form.
- **Owner hard-NO > 60%** → supply side broken. This is the company-killing
  number. Stop outreach, interview 5 owners.
- **Female share < 20%** → trust problem visible already. Same-gender
  matching needs to lead the messaging.
- **First-ride conversion < 50%** of introduced pairs → intros are too weak;
  founder must broker pickup point + time personally, not just introduce.

## Weekly report format (send to advisor)

```
Day N of 14
Responses: X (commit rate Y%)
Owners willing: X / Y owners
Female: X%
Pairs: introduced X | first rides Y | ACTIVE Z | dropped W
Top drop reason (verbatim): "..."
Blocker I'm avoiding: ...
```

That last line is mandatory. Founders always know the answer; they just don't
like typing it.
