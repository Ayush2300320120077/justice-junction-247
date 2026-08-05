# Justice Junction 24/7 — Pre-Launch QA Report

**Audit date:** 2025-08-06  
**Auditor:** Static code analysis (no existing files modified)  
**Scope:** Full-stack MERN application — React/Vite frontend, Node.js/Express serverless backend (Vercel), MongoDB, Razorpay, JWT auth, Admin panel  

---

## Table of Contents

1. [Functional Testing](#1-functional-testing)
2. [Authentication & Session Management](#2-authentication--session-management)
3. [Payment Flow](#3-payment-flow)
4. [AI Features](#4-ai-features)
5. [Security](#5-security)
6. [Responsive Design & Mobile](#6-responsive-design--mobile)
7. [Performance](#7-performance)
8. [Accessibility](#8-accessibility)
9. [Error Handling & UX](#9-error-handling--ux)
10. [Data Integrity](#10-data-integrity)

---

## 1. Functional Testing

### FUNC-01 — Duplicate Template IDs in Document Generator
**Severity:** High  
**File:** [`src/pages/document-generator.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/document-generator.jsx) (lines 33-44, 87-98, 60-72, 100-112)  
**Description:** The `TEMPLATES` array declares `id: 'promissory'` twice (lines 33 and 87) and `id: 'consumer-complaint'` twice (lines 60 and 100). When the template selector maps over this array by `id`, the second definition shadows or duplicates the first.  
**Steps to reproduce:**
1. Navigate to `/document-generator`.
2. Open the template picker.
3. Observe two "Promissory Note" and two "Consumer Complaint" entries.

**Expected:** Each template appears exactly once.  
**Actual:** Duplicates appear in the list.

---

### FUNC-02 — Booking Form Bypasses Real Razorpay Payment
**Severity:** Critical  
**File:** [`src/pages/book.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/book.jsx) (lines 26-44)  
**Description:** `handlePay()` calls `API.createBooking(...)` directly and immediately shows `'Payment Successful! Appointment Booked.'` without initiating any Razorpay payment flow. There is no `razorpay.open()`, no order creation, no payment verification, and no `paymentId`/`signature` passed to the backend. The booking record is created with `isPaid: false` (default) but the toast tells the user payment succeeded.  
**Steps to reproduce:**
1. Log in as a client.
2. Navigate to `/book?lawyerId=...&lawyerName=...&fee=1000`.
3. Select date and time, click "Pay & Confirm".
4. Observe the success toast and redirect to `/dashboard`.

**Expected:** A real Razorpay checkout modal opens; booking confirmed only after payment verification.  
**Actual:** Booking created immediately without any payment; success toast shown.

---

### FUNC-03 — Booking Summary Shows Incorrect Duration
**Severity:** Medium  
**File:** [`src/pages/book.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/book.jsx) (line 104)  
**Description:** The summary sidebar hard-codes "30 Mins". The `Booking` model ([`models/Booking.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/models/Booking.js) line 7) sets `duration: { default: 45 }`. The value shown is inconsistent with what is stored.  
**Steps to reproduce:** Navigate to `/book`. Observe summary card shows "30 Mins".  
**Expected:** Duration matches the model default (45 min) or is fetched from the lawyer profile.  
**Actual:** Hard-coded "30 Mins".

---

### FUNC-04 — Fixed Time Slots Ignore Lawyer Availability Schedule
**Severity:** High  
**File:** [`src/pages/book.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/book.jsx) (line 74)  
**Description:** Five static time slots (`10:00 AM`, `11:30 AM`, `2:00 PM`, `4:30 PM`, `6:00 PM`) are rendered regardless of the lawyer's `availableDays`, `availableTimeFrom`, `availableTimeTo` fields ([`models/Lawyer.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/models/Lawyer.js) lines 58-60) or existing confirmed bookings.  
**Steps to reproduce:**
1. Navigate to `/book?lawyerId=<any>&fee=500`.
2. Select any date including weekends.
3. All five slots are always shown and selectable.

**Expected:** Slots reflect the lawyer's configured availability; already-booked slots greyed out.  
**Actual:** All five slots always shown.

---

### FUNC-05 — "Forgot Password" is a UI-Only Toast (No API Call)
**Severity:** High  
**File:** [`src/pages/login.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/login.jsx) (lines 91-97)  
**Description:** `handleForgotPassword()` shows a toast "Password reset link sent to `<email>`" without calling any API endpoint. The backend has `POST /api/auth/forgot-password` but it is never invoked from the frontend. No email is ever sent.  
**Steps to reproduce:**
1. Navigate to `/login`.
2. Enter any email address.
3. Click "Forgot Password?".
4. Verify in DevTools Network — no network request is made.

**Expected:** A real API call sends a password reset email.  
**Actual:** Toast fires immediately; no API call, no email.

---

### FUNC-06 — Footer Links to Non-Existent Routes
**Severity:** Medium  
**File:** [`src/components/Footer.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/Footer.jsx) (line 25)  
**Description:** The Footer links to `/how-it-works` and `/faq`, but neither route is defined in `src/App.jsx`. Clicking either renders the 404 page.  
**Steps to reproduce:** Scroll to the footer; click "How It Works" or "FAQs".  
**Expected:** The route's page loads.  
**Actual:** 404 page is displayed.

---

### FUNC-07 — Social Media Footer Links are Non-Functional Divs
**Severity:** Low  
**File:** [`src/components/Footer.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/Footer.jsx) (lines 17-19)  
**Description:** The Twitter, LinkedIn, and Instagram icons are `<div>` elements with `cursor: pointer` but no `href`, `onClick`, or navigation. Clicking them does nothing.  
**Expected:** Opens the corresponding social media page in a new tab.  
**Actual:** No action occurs.

---

### FUNC-08 — "Remember Me" Checkbox Has No Effect
**Severity:** Medium  
**File:** [`src/pages/login.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/login.jsx) (lines 392-403, 63-76)  
**Description:** The "Keep me signed in" checkbox value is never passed to `API.login()` or to the backend. JWT tokens are always issued with the same expiry regardless.  
**Steps to reproduce:** Uncheck "Keep me signed in", log in — session behaviour is identical to when it is checked.  
**Expected:** Checkbox affects session persistence.  
**Actual:** Value is never used.

---

### FUNC-09 — Favorites Count in Navbar Does Not Update in Real-Time
**Severity:** Low  
**File:** [`src/components/Navbar.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/Navbar.jsx) (lines 15-18)  
**Description:** `favCount` is read from `localStorage` once on mount (empty deps array). Adding/removing favorites does not update the badge without a full page refresh.  
**Expected:** Badge updates in real-time when favorites change.  
**Actual:** Badge only updates after a full page refresh.

---

## 2. Authentication & Session Management

### AUTH-01 — Role Tab on Login Page Has No Functional Effect
**Severity:** Medium  
**File:** [`src/pages/login.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/login.jsx) (lines 43, 63-76)  
**Description:** The "Client Login" / "Lawyer Portal" tabs set `roleTab` state but the value is never sent to `POST /api/auth/login`. Authentication is identical regardless of which tab is selected.  
**Steps to reproduce:** Select "Lawyer Portal" tab; log in with client credentials — client is logged in normally.  
**Expected:** Tab filters login by role or is removed to avoid confusion.  
**Actual:** Tab is purely cosmetic.

---

### AUTH-02 — Admin Login Uses Raw `fetch` Instead of Shared API Utility
**Severity:** Low  
**File:** [`src/pages/admin/login.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/admin/login.jsx) (line 29)  
**Description:** `AdminLogin` uses direct `fetch('/api/admin/login', ...)` instead of the shared `API` utility. Future changes to the API layer will not apply to admin login.  
**Expected:** Admin login uses the shared `API` utility.  
**Actual:** Standalone `fetch` call.

---

### AUTH-03 — PrivateRoute Redirects Wrong Role to Home Without Explanation
**Severity:** Medium  
**File:** [`src/components/PrivateRoute.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/PrivateRoute.jsx) (lines 29-31)  
**Description:** When a logged-in user with the wrong role accesses a restricted route, `PrivateRoute` silently redirects to `/`. No toast, error message, or reason is shown.  
**Steps to reproduce:** Log in as a client; navigate to `/admin/dashboard` directly; observe silent redirect to `/`.  
**Expected:** User sees "Access Denied" feedback.  
**Actual:** Silent redirect with no feedback.

---

### AUTH-04 — Demo Credentials Hardcoded and Visible in Production
**Severity:** High  
**File:** [`src/pages/login.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/login.jsx) (lines 78-89)  
**Description:** The login page contains a "1-Click Demo Login" section with hardcoded credentials (`client@demo.com` / `demo123`, `lawyer@demo.com` / `demo123`) visible in production (`NODE_ENV=production` in `.env`).  
**Expected:** Demo section hidden in production builds.  
**Actual:** Demo credentials always visible.

---

### AUTH-05 — No Auto Token Refresh on 401 in Frontend API Layer
**Severity:** High  
**File:** `src/api.js`  
**Description:** The `accessToken` has a 15-minute TTL. When it expires mid-session, subsequent API calls fail with 401. There is no 401-interceptor that automatically calls `POST /api/auth/refresh` and retries the original request.  
**Steps to reproduce:** Log in; wait 15+ minutes; attempt any authenticated action.  
**Expected:** Token is silently refreshed and the request succeeds.  
**Actual:** Request fails with 401; user must manually refresh the page.

---

## 3. Payment Flow

### PAY-01 — Razorpay Keys are Placeholder Values in .env
**Severity:** Critical  
**File:** [`.env`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/.env) (lines 3-4)  
**Description:** `RAZORPAY_KEY_ID=rzp_test_placeholder` and `RAZORPAY_KEY_SECRET=placeholder_secret`. Any payment order creation will fail; the entire payment flow is non-functional.  
**Expected:** Real Razorpay test keys configured.  
**Actual:** Placeholder values; no real payment can succeed.

---

### PAY-02 — Frontend Booking Completes Without Payment Verification
**Severity:** Critical  
**File:** [`src/pages/book.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/book.jsx) (lines 26-44)  
**Description:** The booking creation skips the entire Razorpay order creation → checkout modal → payment verification pipeline. Any authenticated user can create a booking record without paying. (See also FUNC-02.)  
**Expected:** Booking only confirmed after successful payment verification.  
**Actual:** Booking created immediately without any payment.

---

### PAY-03 — `platformFee` Falsy-Check Bug
**Severity:** Medium  
**File:** [`models/Booking.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/models/Booking.js) (lines 14-16)  
**Description:** The `pre('save')` hook uses `if (!this.platformFee)`. In JavaScript `0` is falsy, so an intentional `platformFee: 0` would be overwritten with 10% of the fee.  
**Expected:** `if (this.platformFee == null)` used instead.  
**Actual:** `!this.platformFee` treats `0` as missing.

---

### PAY-04 — Subscription Pricing Marked PLACEHOLDER in Code
**Severity:** High  
**File:** [`src/pages/pricing.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/pricing.jsx) (line 8)  
**Description:** Line 8 reads `// PLACEHOLDER PRICING — confirm real numbers before launch`. The plan prices (₹299, ₹999) are unconfirmed developer placeholders.  
**Expected:** Final, reviewed pricing confirmed before launch.  
**Actual:** Explicit in-code warning that prices are not confirmed.

---

## 4. AI Features

### AI-01 — AI Chat Sends Wrong Field Name for Conversation History
**Severity:** High  
**File:** [`src/components/AIAssistantChat.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/AIAssistantChat.jsx) (line 106)  
**Description:** The component calls `API.assistant({ message, conversationHistory, sessionId })`. The backend route `POST /api/ai/chat` ([`api/_routes/ai.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/api/_routes/ai.js) line 448) expects `{ message, history }`. The `conversationHistory` field is never received; multi-turn context is always empty.  
**Steps to reproduce:** Open the AI chat widget; send two messages; the AI has no memory of the first.  
**Expected:** Conversation history properly passed; AI maintains context.  
**Actual:** Each message is treated as a new conversation.

---

### AI-02 — AI Classify Requires Auth; No UX Feedback on 401 for Logged-Out Users
**Severity:** High  
**File:** [`api/_routes/ai.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/api/_routes/ai.js) (line 397); [`src/pages/search.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/search.jsx) (lines 48-68)  
**Description:** `POST /api/ai/classify` requires authentication. The Search page calls `API.classify()` without checking if the user is logged in. Unauthenticated users get a silent 401 — spinner appears and disappears with no error message.  
**Steps to reproduce:** Open `/search` while logged out; type a legal problem; click classify; observe: spinner then nothing.  
**Expected:** Prompt to log in, or button disabled for unauthenticated users.  
**Actual:** Silent 401 failure.

---

### AI-03 — Anthropic API Key is Placeholder; Mock Responses Unlabelled
**Severity:** High  
**File:** [`.env`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/.env) (line 25); [`api/_routes/ai.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/api/_routes/ai.js) (lines 226, 536)  
**Description:** `ANTHROPIC_API_KEY=your_anthropic_api_key_here`. Backend falls back to `generateMockDocument()` or local text responses returning HTTP 200. The frontend cannot distinguish mock from real AI output.  
**Expected:** Real Anthropic key configured, or UI labels responses as "template."  
**Actual:** Mock responses silently presented as AI-generated.

---

### AI-04 — Document Generator Accessible Without Auth (401 After Filling Form)
**Severity:** Medium  
**File:** [`api/_routes/ai.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/api/_routes/ai.js) (line 206); [`src/pages/document-generator.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/document-generator.jsx)  
**Description:** `POST /api/ai/generate-document` requires auth but the frontend page does not redirect unauthenticated users. They can fill the entire form before receiving a 401 on submit.  
**Steps to reproduce:** Log out; navigate to `/document-generator`; fill a complete form; click generate; observe 401.  
**Expected:** Redirect to login before the form is accessible.  
**Actual:** Form fully accessible; 401 only after submission.

---

### AI-05 — `aiLimiter` keyGenerator Crashes if `req.user` is Null
**Severity:** High  
**File:** [`api/_routes/ai.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/api/_routes/ai.js) (line 42)  
**Description:** `keyGenerator: (req) => req.user.id` will throw `TypeError: Cannot read properties of null` if `requireAuth` is ever bypassed or the middleware order is accidentally changed.

---

## 5. Security

### SEC-01 — Real MongoDB Credentials Committed in .env
**Severity:** Critical  
**File:** [`.env`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/.env) (line 1)  
**Description:** `.env` contains a real MongoDB Atlas connection string including username and password. While gitignored, the presence of real production credentials in a local file is a severe risk if accidentally shared, committed, or included in a build artifact.  
**Expected:** Credentials stored only in Vercel environment settings; `.env` holds only placeholders per `.env.example`.  
**Actual:** Real production database credentials in `.env`.

---

### SEC-02 — .env Git History Not Verified Clean
**Severity:** Critical  
**File:** [`.env`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/.env), [`.gitignore`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/.gitignore)  
**Description:** The `.gitignore` correctly lists `.env`, but if `.env` was committed in any past commit (before `.gitignore` was set up), credentials remain accessible via `git log -p`.  
**Steps to reproduce:** Run `git log --all --full-history -- .env` to verify.  
**Expected:** `.env` never appears in any git commit.  
**Actual:** Status unknown — must be verified before launch.

---

### SEC-03 — Voyage and Vector DB Keys are Placeholders
**Severity:** Medium  
**File:** [`.env`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/.env) (lines 26-27)  
**Description:** `VOYAGE_API_KEY=your_voyage_api_key_here` and `VECTOR_DB_URL=http://localhost:8000`. The RAG pipeline silently falls back to degraded local search, misrepresenting AI quality to users.

---

### SEC-04 — `/api/ai/log-outcome` Uses Manual JWT Decode Instead of Auth Middleware
**Severity:** Medium  
**File:** [`api/_routes/ai.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/api/_routes/ai.js) (lines 329-339)  
**Description:** The route manually reads `req.headers.authorization`, splits it, and calls `jwt.verify()` — duplicating logic from `requireAuth`. If JWT secret or token format changes in middleware, this manual decode may be missed.  
**Expected:** Route uses shared `requireAuth` middleware.  
**Actual:** Manual duplicate JWT decode logic.

---

### SEC-05 — `PATCH /api/ai/feedback` Has No Authentication
**Severity:** Medium  
**File:** [`api/_routes/ai.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/api/_routes/ai.js) (lines 370-394)  
**Description:** The feedback endpoint has no authentication middleware. Any unauthenticated user who knows a valid MongoDB ObjectId can set an arbitrary `userFeedbackRating` on any AI interaction log, corrupting admin analytics.  
**Steps to reproduce:**
```
curl -X PATCH /api/ai/feedback \
  -H "Content-Type: application/json" \
  -d '{"logId":"<any_valid_object_id>","rating":1}'
```
**Expected:** Only the originating authenticated user can rate their own log entry.  
**Actual:** No auth check; any party can mutate any log entry.

---

### SEC-06 — SameSite Cookie Attribute Not Verified
**Severity:** Medium  
**Description:** The app uses cookie-based auth. If auth cookies (`accessToken`, `refreshToken`) are not explicitly set with `SameSite=Strict` or `SameSite=Lax`, cross-site requests could send the cookie and bypass IP-based rate limits using an authenticated user's session.  
**Expected:** Auth cookies use `SameSite=Strict` or `SameSite=Lax`.  
**Actual:** `SameSite` attribute value requires verification in auth route's Set-Cookie response headers.

---

### SEC-07 — Email Credentials Missing — All Transactional Emails Fail Silently
**Severity:** High  
**File:** [`.env`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/.env) (lines 21-22)  
**Description:** `EMAIL_USER` and `EMAIL_PASS` are empty. [`utils/mailer.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/utils/mailer.js) gracefully logs a warning and returns. All transactional emails (password reset links, booking confirmations) are silently dropped with no feedback to the end-user.  
**Expected:** Email credentials configured; emails delivered.  
**Actual:** No emails sent; failures silent to end-user.

---

### SEC-08 — Company CIN Fields Empty
**Severity:** Low  
**File:** [`.env`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/.env) (lines 12-13)  
**Description:** `COMPANY_CIN` and `VITE_COMPANY_CIN` are empty. If CIN is displayed for regulatory compliance (required for legal platforms in India), it will be blank on launch.

---

## 6. Responsive Design & Mobile

### RESP-01 — Booking Page Two-Column Grid Breaks on Mobile
**Severity:** High  
**File:** [`src/pages/book.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/book.jsx) (line 58)  
**Description:** `gridTemplateColumns: '1.5fr 1fr'` has no responsive override. On screens narrower than ~600px, the form and summary sidebar are side by side making both unusably narrow.  
**Steps to reproduce:**
1. Navigate to `/book`.
2. Resize viewport to 375px (iPhone SE).
3. Observe two-column grid is not collapsed.

**Expected:** On mobile, form and summary stack vertically.  
**Actual:** Side-by-side layout with unusably narrow columns.

---

### RESP-02 — Admin Panel Has No Mobile Layout
**Severity:** Medium  
**File:** [`src/pages/admin/dashboard.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/admin/dashboard.jsx)  
**Description:** Admin dashboard uses complex multi-column grids without mobile breakpoints. On a phone, the admin panel overflows horizontally and is difficult to use.

---

### RESP-03 — Mobile Menu Gap After Scrolling
**Severity:** Low  
**File:** [`src/components/Navbar.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/Navbar.jsx) (line 183)  
**Description:** Mobile menu overlay is positioned at `top: 100px`. After scrolling (Navbar moves to `top: 0`), a 28px gap appears between the Navbar bottom and the mobile menu top.  
**Steps to reproduce:** On a mobile viewport, scroll down 10px; open the hamburger menu; observe the gap.  
**Expected:** Menu attaches directly beneath the Navbar at all scroll positions.  
**Actual:** Gap appears after any scrolling.

---

### RESP-04 — AI Chat Widget May Overlap WhatsApp FAB on Small Screens
**Severity:** Low  
**File:** [`src/components/AIAssistantChat.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/AIAssistantChat.jsx) (lines 138-141)  
**Description:** AI launcher positioned at `bottom: 80px` on mobile to stack above WhatsApp. If the WhatsApp FAB occupies the same position, the two buttons overlap on 320px-wide screens.

---

## 7. Performance

### PERF-01 — Home Page is a 2,167-Line Component with Unthrottled Scroll Listener
**Severity:** Medium  
**File:** [`src/pages/index.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/index.jsx) (2,167 lines, ~115 KB)  
**Description:** The entire home page is a single React component. The `scrollY` state is updated on every scroll event without debouncing or throttling, causing excessive re-renders. The inline `<style>` block is also re-injected on every render.  
**Steps to reproduce:** DevTools → Performance → Record while scrolling on the home page; observe repeated render cycles on every pixel scrolled.  
**Expected:** Scroll handler debounced; styles in CSS files; component split into smaller pieces.  
**Actual:** Unbounced scroll listener updating state on every scroll event.

---

### PERF-02 — No `maxPoolSize` for Serverless MongoDB Connections
**Severity:** Medium  
**File:** [`middleware/db.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/middleware/db.js)  
**Description:** `connectDB()` calls `mongoose.connect()` without setting `maxPoolSize`. Under moderate concurrent serverless invocations, MongoDB Atlas's connection limit can be exhausted.  
**Expected:** `maxPoolSize` tuned for serverless (e.g., `maxPoolSize: 5`).  
**Actual:** No explicit pool size set.

---

### PERF-03 — Document Generator Has All Templates in Client Bundle
**Severity:** Low  
**File:** [`src/pages/document-generator.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/document-generator.jsx) (1,390 lines, ~74 KB)  
**Description:** All 12+ document templates and full field definitions are in the frontend bundle, increasing initial JS parse time. Could be lazy-loaded or fetched from the API.

---

### PERF-04 — `demoLawyers.js` Always Imported Regardless of API Status
**Severity:** Low  
**File:** [`src/pages/search.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/search.jsx) (line 9)  
**Description:** `demoLawyers` is imported statically and always bundled (9,347 bytes). It is only used when the API fails. The import should be dynamic.

---

## 8. Accessibility

### A11Y-01 — `textAlignment` Typo (Invalid CSS Property)
**Severity:** Low  
**File:** [`src/pages/login.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/login.jsx) (line 263)  
**Description:** `style={{ textAlignment: 'left' }}` uses a non-existent CSS property (correct: `textAlign`). The alignment is silently ignored.

---

### A11Y-02 — Hamburger Button Missing `aria-expanded`
**Severity:** Medium  
**File:** [`src/components/Navbar.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/Navbar.jsx) (line 94)  
**Description:** The hamburger button has `aria-label="Toggle Navigation Menu"` but no `aria-expanded`. Screen readers cannot determine whether the menu is open or closed.  
**Expected:** `aria-expanded={mobileOpen}` added to the toggle button.  
**Actual:** Only `aria-label` is set.

---

### A11Y-03 — Booking Form Inputs Have No Label-Input Association
**Severity:** High  
**File:** [`src/pages/book.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/book.jsx) (lines 64-95)  
**Description:** The date input and textarea have `<label>` elements without matching `htmlFor`/`id` attributes. Screen readers cannot programmatically associate labels with inputs. Time slot buttons have no `aria-pressed` to indicate selected state.  
**Expected:** Each input has `id`; its label has matching `htmlFor`.  
**Actual:** Labels and inputs are siblings without programmatic association.

---

### A11Y-04 — AI Chat Panel Has No Dialog ARIA Role
**Severity:** Medium  
**File:** [`src/components/AIAssistantChat.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/AIAssistantChat.jsx) (line 211)  
**Description:** The AI chat panel `<div>` has no `role="dialog"`, `aria-modal="true"`, or `aria-label`. Screen readers cannot identify it as a dialog; focus is not trapped within the panel when it opens.  
**Expected:** `role="dialog"`, `aria-modal`, `aria-label`, and focus management implemented.  
**Actual:** Plain `<div>` with no ARIA dialog semantics.

---

### A11Y-05 — Decorative Emojis Not `aria-hidden`
**Severity:** Low  
**File:** [`src/pages/index.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/index.jsx) (AREAS data, lines 108-120)  
**Description:** Practice area cards render emojis (⚖️, 👨‍👩‍👧, 🏠, etc.) as text content. Screen readers read out verbose emoji descriptions. These should have `aria-hidden="true"`.

---

### A11Y-06 — Potential Insufficient Color Contrast on Semi-Transparent Elements
**Severity:** Medium  
**File:** [`src/components/Navbar.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/components/Navbar.jsx) (lines 175, 177)  
**Description:** Navbar links use `color: 'rgba(255,255,255,0.9)'` and icon buttons use `rgba(255,255,255,0.75)` against dark semi-transparent backgrounds. Over certain hero images, contrast ratios may fall below the WCAG AA minimum of 4.5:1 for normal text.

---

## 9. Error Handling & UX

### ERR-01 — Contact Form Shows Success Even When Both Delivery Methods Fail
**Severity:** Medium  
**File:** [`src/pages/contact.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/contact.jsx) (lines 67-75)  
**Description:** When EmailJS is unconfigured and the DB save also fails (`dbSaved = false`), the code still calls `showToast('Message received!', 'success')` and sets `setSubmitted(true)`. The user believes their message was received when it was not.  
**Expected:** Show error toast if neither DB nor email delivery succeeded.  
**Actual:** Success toast shown regardless of delivery outcome.

---

### ERR-02 — Booking API Error Shows Generic Toast With No Guidance
**Severity:** Low  
**File:** [`src/pages/book.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/book.jsx) (lines 38-41)  
**Description:** If `API.createBooking()` fails, a generic error toast appears. The form is not reset and no guidance is given on next steps (retry, contact support, etc.).

---

### ERR-03 — No Error Boundary for Lazy-Loaded Pages
**Severity:** Medium  
**File:** `src/App.jsx`  
**Description:** `React.lazy()` is used for all page components without an `<ErrorBoundary>`. If a lazy chunk fails to load (network error, chunk hash mismatch after a deployment), the app crashes with a blank screen.  
**Steps to reproduce:** Deploy a new version while a user has the old version cached; the user navigates to a new route; old chunk hash is missing — lazy import fails.  
**Expected:** Error boundary shows "Page failed to load — please refresh."  
**Actual:** Blank white screen.

---

### ERR-04 — App Shows Blank Screen During Auth Resolution
**Severity:** Low  
**File:** [`src/context/AuthContext.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/context/AuthContext.jsx) (line 36)  
**Description:** `AuthProvider` renders nothing while `loading: true` (`{!loading && children}`). On slow networks or cold starts, `API.me()` can take several seconds leaving a blank white screen.  
**Expected:** Global loading indicator shown while auth state resolves.  
**Actual:** Blank white screen.

---

## 10. Data Integrity

### DATA-01 — Case Number Generation Has Collision Risk
**Severity:** Medium  
**File:** [`models/Booking.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/models/Booking.js) (line 14)  
**Description:** `caseNumber` is generated as `'JJ-' + year + '-' + Math.floor(10000 + Math.random() * 90000)` (90,000 possible values/year). The birthday problem gives ~50% collision probability at ~316 bookings/year. The field has `unique: true`; MongoDB throws `E11000` on collision and the `pre('save')` hook does not handle this, causing an unhandled 500 error.  
**Expected:** Guaranteed-unique generation (e.g., counter, UUID, or retry on collision).  
**Actual:** Random 5-digit suffix with no collision handling.

---

### DATA-02 — Dual Sources of Truth for Reviews
**Severity:** High  
**File:** [`models/Lawyer.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/models/Lawyer.js) (lines 33-34); [`api/_routes/reviews.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/api/_routes/reviews.js) (lines 38-40)  
**Description:** Reviews are stored in both a separate `Review` collection and embedded in `Lawyer.reviews[]`. The `POST /api/reviews` route updates `averageRating` and `totalReviews` by querying the `Review` collection but does NOT push to the embedded array. `Lawyer.updateRating()` (line 69) operates on `this.reviews`. These two counts can diverge silently.  
**Expected:** A single source of truth for reviews.  
**Actual:** Two separate mechanisms that can diverge.

---

### DATA-03 — `User.isVerified` and `User.verificationStatus` Are Redundant Fields
**Severity:** Low  
**File:** [`models/User.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/models/User.js) (lines 14-15)  
**Description:** The User model has both `verificationStatus: { enum: ['pending','verified','rejected'] }` and `isVerified: Boolean`. These can diverge if not updated atomically on every status change.

---

### DATA-04 — Hero Stats Are Hard-Coded, Not Fetched from Database
**Severity:** Medium  
**File:** [`src/pages/index.jsx`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/src/pages/index.jsx) (lines 730-732)  
**Description:** The hero advertises "1,338+ Bar Council verified advocates" and "100+ cities" as static string literals — not fetched from the database. Actual lawyer count may differ.  
**Expected:** Stats fetched from a backend aggregation endpoint.  
**Actual:** Hardcoded static marketing figures.

---

### DATA-05 — Reviews Allowed on Incomplete Bookings
**Severity:** High  
**File:** [`api/_routes/reviews.js`](file:///c:/Users/Ayush%20Kumar/Downloads/justice-junction-FIXED/jj-fixed/api/_routes/reviews.js) (lines 22-27)  
**Description:** The review endpoint verifies the booking exists and belongs to the client, but does NOT check `booking.status === 'completed'`. A client can submit a review for a consultation that has not yet occurred.  
**Steps to reproduce:**
1. Create a booking (status: `pending`).
2. POST a review with that `bookingId`.
3. Review is accepted; lawyer rating is updated.

**Expected:** Reviews only allowed for `status: 'completed'` bookings.  
**Actual:** Any booking status accepted.

---

## Summary Table

| ID | Category | Severity | Title |
|----|----------|----------|-------|
| FUNC-01 | Functional | **High** | Duplicate Template IDs in Document Generator |
| FUNC-02 | Functional | **Critical** | Booking Form Bypasses Real Razorpay Payment |
| FUNC-03 | Functional | Medium | Booking Summary Shows Incorrect Duration (30 vs 45 min) |
| FUNC-04 | Functional | **High** | Fixed Time Slots Ignore Lawyer Availability |
| FUNC-05 | Functional | **High** | Forgot Password is UI-Only Toast (No API Call) |
| FUNC-06 | Functional | Medium | Footer Links to Non-Existent Routes |
| FUNC-07 | Functional | Low | Social Media Footer Links are Non-Functional Divs |
| FUNC-08 | Functional | Medium | "Remember Me" Checkbox Has No Effect |
| FUNC-09 | Functional | Low | Favorites Count Stale Without Page Refresh |
| AUTH-01 | Auth | Medium | Role Tab on Login Has No Functional Effect |
| AUTH-02 | Auth | Low | Admin Login Uses Raw fetch Instead of Shared API |
| AUTH-03 | Auth | Medium | PrivateRoute Redirects Wrong Role Silently |
| AUTH-04 | Auth | **High** | Demo Credentials Hardcoded Visible in Production |
| AUTH-05 | Auth | **High** | No Auto Token Refresh on 401 |
| PAY-01 | Payment | **Critical** | Razorpay Keys are Placeholder Values |
| PAY-02 | Payment | **Critical** | Booking Completes Without Payment Verification |
| PAY-03 | Payment | Medium | platformFee Falsy-Check Bug |
| PAY-04 | Payment | **High** | Subscription Pricing Marked PLACEHOLDER |
| AI-01 | AI | **High** | AI Chat Sends Wrong Field Name for History |
| AI-02 | AI | **High** | AI Classify Requires Auth; No UX Feedback on 401 |
| AI-03 | AI | **High** | Anthropic Key is Placeholder; Mock Responses Unlabelled |
| AI-04 | AI | Medium | Document Generator Accessible Without Auth (401 After Fill) |
| AI-05 | AI | **High** | aiLimiter keyGenerator Crashes if req.user is Null |
| SEC-01 | Security | **Critical** | Real MongoDB Credentials in .env |
| SEC-02 | Security | **Critical** | .env Git History Not Verified Clean |
| SEC-03 | Security | Medium | Voyage/Vector Keys are Placeholders |
| SEC-04 | Security | Medium | /log-outcome Uses Manual JWT Decode Instead of Middleware |
| SEC-05 | Security | Medium | /ai/feedback Has No Authentication |
| SEC-06 | Security | Medium | SameSite Cookie Attribute Not Verified |
| SEC-07 | Security | **High** | Email Credentials Missing — Transactional Emails Fail Silently |
| SEC-08 | Security | Low | Company CIN Fields Empty |
| RESP-01 | Responsive | **High** | Booking Page Two-Column Grid Breaks on Mobile |
| RESP-02 | Responsive | Medium | Admin Panel Has No Mobile Layout |
| RESP-03 | Responsive | Low | Mobile Menu Gap After Scrolling |
| RESP-04 | Responsive | Low | AI Chat Widget May Overlap WhatsApp FAB |
| PERF-01 | Performance | Medium | Home Page 2,167-Line Component with Unthrottled Scroll |
| PERF-02 | Performance | Medium | No maxPoolSize for Serverless MongoDB Connections |
| PERF-03 | Performance | Low | Document Generator Has All Templates in Client Bundle |
| PERF-04 | Performance | Low | demoLawyers.js Always Imported |
| A11Y-01 | Accessibility | Low | textAlignment Typo (Invalid CSS Property) |
| A11Y-02 | Accessibility | Medium | Hamburger Button Missing aria-expanded |
| A11Y-03 | Accessibility | **High** | Booking Form Inputs Have No Label-Input Association |
| A11Y-04 | Accessibility | Medium | AI Chat Panel Has No Dialog ARIA Role |
| A11Y-05 | Accessibility | Low | Decorative Emojis Not aria-hidden |
| A11Y-06 | Accessibility | Medium | Potential Insufficient Color Contrast |
| ERR-01 | Error Handling | Medium | Contact Form Shows Success Even When Delivery Fails |
| ERR-02 | Error Handling | Low | Booking Error Shows Generic Toast With No Guidance |
| ERR-03 | Error Handling | Medium | No Error Boundary for Lazy-Loaded Pages |
| ERR-04 | Error Handling | Low | App Blank Screen During Auth Resolution |
| DATA-01 | Data Integrity | Medium | Case Number Collision Risk |
| DATA-02 | Data Integrity | **High** | Dual Sources of Truth for Reviews |
| DATA-03 | Data Integrity | Low | User.isVerified and verificationStatus Are Redundant |
| DATA-04 | Data Integrity | Medium | Hero Stats Hard-Coded, Not DB-Fetched |
| DATA-05 | Data Integrity | **High** | Reviews Allowed on Incomplete Bookings |

---

## Severity Counts

| Severity | Count |
|----------|-------|
| **Critical** | 5 |
| **High** | 18 |
| Medium | 19 |
| Low | 13 |
| **Total** | **55** |

---

## Confirmation

**No existing source files were modified during this audit.**  
All findings are based solely on static code reading and logical analysis. The only output file created is this `QA-REPORT.md`.
