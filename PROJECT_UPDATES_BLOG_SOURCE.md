# Askesis Exam Prep: Project Updates and Bug-Fix History

## Overview

Askesis is an adaptive exam-preparation platform for SAT, ACT, GRE, GMAT, SHSAT, and Regents preparation. During this development cycle, the project received improvements across deployment reliability, authentication, study tracking, spaced repetition, analytics, and user experience.

The work began with repeated Vercel deployment failures. After deployment was stabilized, testing exposed several functional problems: Google authentication could create accounts from unverified input, study and review screens used incorrect API contracts, analytics displayed fabricated fallback numbers, and production builds failed because dependencies and generated artifacts were inconsistent.

This document is written as source material for a technical or product blog post.

## Starting Point

The project is a Next.js frontend with a FastAPI backend and a local Next.js mock API layer used by the frontend. The frontend lives in `frontend/`, and deployment is connected to the GitHub repository `SAIMON-AHMED/askesis-exam-prep`.

The project uses:

- Next.js 16.3.1
- React 19.2.8
- TypeScript 5.5.4
- Axios for API requests
- Recharts for analytics visualizations
- Google Gemini through `@google/genai`
- Google Identity Services for Google sign-in
- Webpack for production builds on Vercel

## 1. Vercel Deployment Recovery

### Original symptoms

Vercel initially failed while installing dependencies:

```text
bun install
error: Unknown lockfile version
UnknownLockfileVersion: failed to parse lockfile: 'bun.lock'
```

The repository contained a legacy root-level Bun lockfile using a lockfile format that the Vercel Bun version could not parse. At the same time, the actual frontend package and npm lockfile lived under `frontend/`.

After dependency installation was addressed, Vercel reached the Next.js build but failed in its post-build processing:

```text
Error: ENOENT: no such file or directory, open
'/vercel/path0/frontend/.next/next-server.js.nft.json'
```

### Changes made

The deployment configuration was made explicit in `frontend/vercel.json`:

- Vercel uses npm instead of relying on package-manager auto-detection.
- The install command detects whether Vercel is running from the repository root or from the `frontend` directory.
- The build command uses the same root-aware behavior.
- The legacy root `bun.lock` was removed.
- A synchronized `frontend/package-lock.json` was restored.
- The frontend package declares `npm@10.8.2` as its package manager.

The resulting configuration supports both common Vercel setups:

```json
{
  "installCommand": "if [ -f frontend/package.json ]; then npm install --prefix frontend; else npm install; fi",
  "buildCommand": "if [ -f frontend/package.json ]; then npm run build --prefix frontend; else npm run build; fi"
}
```

### Turbopack and NFT artifact compatibility

Next.js 16 defaults to Turbopack for builds. Vercel's `onBuildComplete` processing expected the `next-server.js.nft.json` server-trace artifact, but the Turbopack output did not match that expectation in this deployment setup.

The production script was changed from:

```json
"build": "next build"
```

to:

```json
"build": "next build --webpack"
```

This restored the expected server-trace artifact and allowed Vercel post-build processing to complete.

### Additional dependency repairs

Once the correct build path was used, the build surfaced missing dependencies that had been introduced by earlier feature work:

- `@google/genai` was missing even though two AI assistant API routes imported it.
- `canvas-confetti` was missing even though the dashboard celebration utility imported it.
- `@types/canvas-confetti` was missing, causing a TypeScript declaration error.

All three were added to the frontend dependency graph and the npm lockfile was regenerated.

### Result

The production build completed successfully and generated all application routes. The final validated build generated 81 routes, including the dashboard, analytics, study-time APIs, review APIs, AI assistant APIs, authentication APIs, and legal pages.

## 2. Google Authentication Security Repair

### Original problem

The Google sign-in component contained a simulated account picker. If Google Identity Services was unavailable, a user could enter any email address and continue. The API route also trusted the submitted email and name fields.

The API attempted to decode a Google credential payload locally but did not verify the credential signature. Decoding a JWT is not authentication; an attacker can construct an unsigned or forged payload that looks like a valid token.

This created a serious identity-association flaw: someone could potentially create or access a session under another user's email address.

### Changes made

The fake account selector and custom email form were removed from `GoogleSignInButton`.

The component now:

- Uses Google Identity Services when it is available.
- Requires a real Google credential.
- Reports a clear configuration or initialization error if Google sign-in is unavailable.
- Does not manufacture a default account.
- Does not accept arbitrary email and name input as a substitute for Google authentication.

The `/api/auth/google` route now verifies the credential through Google's `tokeninfo` endpoint before creating a session. It checks that:

- A configured Google client ID exists.
- The request includes a credential.
- Google accepts the credential.
- The credential audience matches the configured client ID.
- The Google email is verified.
- The credential contains an email address.

Only after those checks does the route use the Google email and name to create or update the user session.

### Why this matters

Authentication data must be verified by a trusted authority before it is used as an account identity. Reading fields from a JWT without validating its signature and audience only parses user-controlled text; it does not prove who issued the credential.

## 3. Study-Time and Dashboard Fixes

### Original symptoms

The dashboard showed a hard-coded second "Welcome back" message below the actual daily study goal card.

The daily study goal card also began with demo values such as 1.2 hours completed, a 2-hour target, and a 12-day streak. If the API request failed, those values remained visible, making the card appear functional while displaying data that did not belong to the current account.

The profile and analytics screens could also show stale or unrelated totals because study activity was not consistently reflected through the same data path.

### Changes made

The duplicate dashboard welcome card was removed. The main dashboard welcome heading remains, while the study goal card is the single source of study progress on the dashboard.

The daily study goal card now:

- Starts from zero rather than invented progress values.
- Loads `/api/study-time/today` for the current account data.
- Displays an error notification when the request fails instead of silently presenting demo progress.
- Updates immediately after a successful log or quick-add action.
- Uses the returned daily total, target, percentage, remaining time, logs, and streak.

The study-time API updates:

- Today's study hours.
- The user's total study hours.
- The study log collection.
- Goal completion and remaining time.
- Daily progress percentage.

## 4. Review Queue and Selectable Options

### Original symptoms

The review queue showed a load error in the UI. Review card options were rendered as clickable `div` elements and only behaved as selectable answers in quiz mode. This made options difficult or impossible to select in the normal flashcard presentation and reduced keyboard accessibility.

Review ratings were also sent as strings such as `again`, `hard`, `good`, and `easy`, while the route compared the rating numerically. As a result, the spaced-repetition interval calculation did not reliably reflect the selected rating.

### Changes made

The API client now avoids using a local `localhost` base URL in deployed browser builds. When a configured API URL points to localhost, requests fall back to the same-origin `/api` routes. This prevents deployed pages from trying to contact a developer machine.

Review options in `FlashReviewDeck` are now native `button` elements. They:

- Work in both flashcard and quiz presentation modes.
- Can be selected with a mouse or keyboard.
- Stop accepting changes after an answer is chosen.
- Reveal the answer and explanation after selection.

The review answer route now normalizes rating values:

- `again` maps to a low quality score.
- `hard` maps to a lower quality score.
- `good` maps to a passing quality score.
- `easy` maps to a high quality score.

The interval update then uses the normalized score rather than comparing a string to a number.

## 5. Forgot-Password Network Error

### Original symptom

The forgot-password screen displayed `Network Error`. The browser was using an API base URL pointing at `http://localhost:8000`, which is not reachable by a deployed user.

### Changes made

The shared Axios client was updated to reject localhost API URLs in the browser deployment context and use the same-origin `/api` fallback instead.

The forgot-password request now reaches the Next.js route at:

```text
/api/auth/forgot-password
```

That route creates an expiring reset token and can send through Resend or SendGrid when the corresponding environment variables are configured. In development or simulation mode, it returns a reset-link preview to make testing possible.

## 6. Analytics Personalization

### Original symptoms

The analytics page contained several fixed demo values, including:

- Average score.
- Exam count fallbacks.
- Study streak values.
- Weekly adherence percentage.
- Monthly study total.
- Best day of the week.
- Four fabricated weeks in the consistency heatmap.
- Fixed topic mastery cards.
- Fixed study-time breakdown values.

The analytics hooks also requested endpoint names that did not match the implemented routes. For example, the hook requested `/analytics/study-time` while the available route was `/analytics/study-time-breakdown`. The streak hook requested `/analytics/streak` while the implemented route was `/analytics/study-streak`.

These mismatches caused empty charts and error messages such as:

```text
Failed to load weekly consistency heatmap
No data available
```

### Changes made

The analytics hooks now use the implemented endpoint names.

Analytics overview values are calculated from account data:

- Total study hours come from the user's study total.
- Completed exams come from the user's exam history.
- Average score is calculated from available exam-history accuracy values.
- Last-seven-day study hours are calculated from study logs.

Study-time breakdown is grouped from the user's actual logs by exam type.

Weekly study statistics are generated from the last seven days of the user's study logs rather than from a fixed array.

The streak endpoint calculates the current streak from consecutive dates represented in the user's study logs.

The weekly consistency heatmap now generates 28 days from actual logs and the user's configured daily goal. Each day includes:

- Study hours.
- Intensity level.
- Goal completion.
- Topics studied.
- Notes from logged sessions.
- Active-day status.

The topic matrix no longer falls back to fabricated high-yield topics. It uses topics represented in the account's study logs and displays a clear empty state when the account has not completed practice activity that can produce mastery data.

The analytics page no longer substitutes fake nonzero values when the real value is zero. A new or inactive account can correctly see zero hours, zero exams, zero streak, and empty charts.

## 7. Data Model and Current Mock-Backend Limitation

The frontend Next API routes currently use an in-memory `mockBackend` store. This is useful for local development and demonstrations, but it has an important limitation:

- Data is held in server process memory.
- Data can reset when the server restarts or redeploys.
- Multiple users are not fully isolated by persistent database identity in this mock layer.
- Serverless instances may not share the same in-memory state.

The UI and route calculations are now internally consistent and account-aware within that store. For production-grade multi-user persistence, the same endpoints should read and write the authenticated user's records in the FastAPI/database backend, with the user ID taken from a verified access token rather than from a global singleton store.

This limitation should be mentioned in a technical blog post as an intentional development-stage architecture decision, not presented as a final persistence solution.

## 8. Validation Performed

The following checks were run during the repair cycle:

- `npm install` using the frontend package configuration.
- Clean npm installation using the frontend lockfile.
- Frontend TypeScript checks through `next build`.
- Production builds using `next build --webpack`.
- Frontend linting.
- Direct editor diagnostics on touched files.
- Git diff whitespace validation with `git diff --check`.
- Remote branch synchronization checks.

The final production build completed with:

```text
Compiled successfully
Finished TypeScript
Generating static pages using 15 workers (81/81)
```

The local machine emitted warnings because Windows application-control policy blocked the native SWC binary and Next used WebAssembly bindings. The build still completed successfully with Webpack. Vercel's Linux build environment has native Linux bindings available.

The repository still contains unrelated local homepage/legal-page edits that were deliberately left uncommitted during these fixes.

## 9. Shipped Commit Timeline

The important commits in this update sequence are:

- `43bcae7` - Add missing AI route dependency.
- `7a04db3` - Fix Vercel frontend install path.
- `d9c7699` - Make Vercel root detection portable and remove the legacy Bun lockfile.
- `58528a5` - Avoid Vercel lockfile detection failure.
- `9ac2e48` - Use Webpack for Vercel production builds.
- `86b3659` - Merge remote authentication updates.
- `d6e515f` - Secure the Google sign-in flow.
- `686603f` - Add missing confetti dependencies.
- `99993f2` - Fix review and study tracking flows.
- `480b5a0` - Fix user study dashboard data.
- `f149b2d` - Make analytics data user-specific.
- `9d6ac8e` - Use account data for topic analytics.

The latest shipped commit at the time of writing is `9d6ac8e`, and the local `main` branch is synchronized with `origin/main`.

## Suggested Blog Narrative

A strong blog post can frame this work as a progression from deployment failure to product reliability:

1. A lockfile mismatch exposed that the repository structure and deployment root were not aligned.
2. Once deployment became deterministic, build failures revealed missing dependencies and an output-format mismatch.
3. Authentication review uncovered that simulated Google sign-in behavior was unsafe to keep in a real product.
4. User reports exposed misleading demo data in study tracking and analytics.
5. Endpoint contract checks connected the visible review, password-reset, and chart failures to concrete implementation mismatches.
6. The final result is a buildable application whose dashboard and analytics reflect recorded account activity instead of hard-coded sample values.
7. The next production step is moving the mock in-memory data layer fully onto authenticated database-backed records.

## Closing Summary

This cycle improved Askesis in three dimensions:

- Reliability: Vercel now installs and builds the correct frontend project with a compatible output format.
- Trust: Google authentication no longer accepts fabricated identities or unverified credentials.
- Product correctness: study tracking, review interactions, password reset, dashboard metrics, and analytics now follow real API responses and account activity.

The most important remaining architectural task is persistence and isolation: replacing the in-memory mock store with authenticated, database-backed user records for production use.
