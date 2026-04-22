# ⚖ Justice Junction 24/7 — Startup Edition
### Complete Full-Stack Legal Platform | React + Node + MongoDB + Razorpay + Netlify

---

## 💰 HOW THIS PLATFORM MAKES MONEY

### Revenue Stream 1 — Platform Commission (10%)
Every consultation booked through the platform deducts 10% automatically.
- Example: Client books Adv. Sharma for ₹4,500
- Lawyer receives: ₹4,050
- Platform earns: ₹450 per booking
- At 100 bookings/month = **₹45,000/month**

### Revenue Stream 2 — Lawyer Subscription Plans

| Plan    | Price      | Bookings/mo | Features               |
|---------|------------|-------------|------------------------|
| Basic   | ₹999/mo    | 20          | Basic listing          |
| Pro     | ₹2,499/mo  | 60          | Featured + Verified ✅  |
| Elite   | ₹4,999/mo  | Unlimited   | Top placement + Elite ✅|

- At 100 Pro lawyers = **₹2,49,900/month**
- At 50 Elite lawyers = **₹2,49,950/month**

### Revenue Stream 3 — Featured Listings (Future)
Lawyers pay extra to appear at top of search results.

### Revenue Projection (Month 12)
- 200 bookings/day × 10% × ₹2,500 avg = **₹50,000/day**
- 300 subscribed lawyers avg ₹2,000/mo = **₹6,00,000/month**
- **Total projected: ₹21,00,000+/month**

---

## 🏗 TECH STACK

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18 + Vite + React Router    |
| Styling     | Pure CSS (custom design system)   |
| Backend     | Node.js + Express + Serverless    |
| Database    | MongoDB Atlas (Free tier to start)|
| Auth        | JWT (JSON Web Tokens)             |
| Payments    | Razorpay (India's #1 gateway)     |
| Hosting     | Netlify (Free tier available)     |
| Video Calls | Jitsi Meet (free, no setup)       |

---

## 📁 PROJECT STRUCTURE

```
jj-startup/
├── src/
│   ├── pages/
│   │   ├── Home.jsx          ← Startup landing page
│   │   ├── Search.jsx        ← Search lawyers with filters
│   │   ├── Book.jsx          ← Book + Razorpay payment
│   │   ├── Dashboard.jsx     ← Client & Lawyer dashboard
│   │   ├── LawyerPlans.jsx   ← Subscription plans page
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Favorites.jsx
│   │   └── About.jsx
│   ├── components/
│   │   ├── Navbar.jsx        ← Responsive navbar
│   │   ├── Footer.jsx
│   │   ├── LawyerCard.jsx    ← With save/compare/book
│   │   └── AIChatWidget.jsx  ← AI Legal Assistant bot
│   ├── context/
│   │   ├── AuthContext.jsx   ← Global auth state
│   │   └── ToastContext.jsx  ← Notifications
│   ├── api.js                ← All API calls
│   └── App.jsx               ← Routes
│
├── netlify/functions/         ← Backend (Serverless)
│   ├── auth.js               ← Register, Login
│   ├── lawyers.js            ← Search, List, Seed
│   ├── bookings.js           ← Create & manage bookings
│   ├── cases.js              ← Real-time case updates
│   └── payments.js           ← Razorpay integration
│
├── models/                    ← MongoDB Schemas
│   ├── User.js
│   ├── Lawyer.js             ← With subscription fields
│   ├── Booking.js            ← With payment fields
│   └── CaseUpdate.js
│
├── netlify.toml              ← Build & redirect config
├── vite.config.js
├── package.json
└── .env.example              ← Copy this to .env
```

---

## 🚀 COMPLETE SETUP GUIDE

### STEP 1 — Install Required Software

**Node.js** (required)
→ https://nodejs.org → Download LTS → Install
→ Verify: `node --version` (should show v18+)

**VS Code** → https://code.visualstudio.com

**Git** → https://git-scm.com/download/win

---

### STEP 2 — Open Project in VS Code

1. Unzip `jj-startup.zip` to your Desktop
2. Open VS Code → **File → Open Folder** → select `jj-startup`
3. Open terminal: **Ctrl + `**

```bash
npm install
npm install -g netlify-cli
```

---

### STEP 3 — Set Up MongoDB Atlas (Free)

1. Go to → https://cloud.mongodb.com (you already have an account!)
2. Click your **Cluster0** → **Get connection string**
3. Select **Drivers → Node.js** → Copy connection string
4. **Security → Network Access → Add IP → Allow from Anywhere** (`0.0.0.0/0`)

---

### STEP 4 — Set Up Razorpay (Payment Gateway)

1. Go to → https://dashboard.razorpay.com
2. Sign up for free (takes 2 minutes)
3. Go to **Settings → API Keys → Generate Test Key**
4. Copy your **Key ID** and **Key Secret**
5. For live payments later: complete KYC and activate live mode

---

### STEP 5 — Create .env File

In VS Code, create a file named `.env`:

```env
MONGODB_URI=mongodb+srv://ayush:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/justicejunction?retryWrites=true&w=majority
JWT_SECRET=justice_junction_production_secret_2025
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET_HERE
NODE_ENV=development
VITE_API_BASE=/api
```

---

### STEP 6 — Run Locally

```bash
netlify dev
```

Open → **http://localhost:8888** 🎉

**Seed demo lawyers (first time only):**
Open browser console (F12) and run:
```javascript
fetch('/api/lawyers/seed/demo',{method:'POST'}).then(r=>r.json()).then(console.log)
```

---

### STEP 7 — Test Payment Flow

1. Register as a client
2. Find any lawyer → Book Now
3. Fill case details → Continue to Payment
4. Use Razorpay test card: `4111 1111 1111 1111` | CVV: `123` | Expiry: any future date
5. Payment succeeds → booking confirmed in dashboard ✅

**Test Lawyer Subscription:**
1. Register as a lawyer
2. Go to `/lawyer-plans`
3. Click "Get Pro Plan"
4. Use same test card details

---

### STEP 8 — Deploy to Netlify

**8.1 — Push to GitHub:**
```bash
git init
git add .
git commit -m "Justice Junction Startup - Production Ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/justice-junction.git
git push -u origin main
```

**8.2 — Connect to Netlify:**
1. Go to → https://app.netlify.com
2. **Add new site → Import from GitHub**
3. Select your repository
4. Build settings (auto-detected from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. Click **Deploy site**

**8.3 — Add Environment Variables on Netlify:**
Site Settings → Environment variables → Add these:

| Variable              | Value                    |
|-----------------------|--------------------------|
| `MONGODB_URI`         | your mongodb connection  |
| `JWT_SECRET`          | your jwt secret          |
| `RAZORPAY_KEY_ID`     | rzp_live_... (or test)   |
| `RAZORPAY_KEY_SECRET` | your razorpay secret     |
| `NODE_ENV`            | production               |

6. **Deploys → Trigger deploy → Deploy site**

---

### STEP 9 — Go Live with Real Payments

1. Log in to Razorpay dashboard
2. Complete KYC verification (PAN + Bank account)
3. Switch from Test to **Live mode**
4. Generate **Live API Keys**
5. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Netlify env vars
6. Redeploy → You are now accepting real money! 💰

---

## 🌐 PAGES & URLS

| Page              | URL              | Description                     |
|-------------------|------------------|---------------------------------|
| Landing Page      | /                | Startup homepage                |
| Find Lawyers      | /search          | Search with filters             |
| Book Consultation | /book            | Book + Razorpay payment         |
| Client Dashboard  | /dashboard       | Bookings, case updates          |
| Lawyer Dashboard  | /dashboard       | Clients, post updates, earnings |
| Lawyer Plans      | /lawyer-plans    | Subscription pricing            |
| Saved Lawyers     | /favorites       | Saved lawyer list               |
| How It Works      | /about           | FAQ, process, trust             |
| Login             | /login           |                                 |
| Register          | /register        | Client or Lawyer signup         |

---

## 📊 ADMIN PANEL (Next Phase)

To build an admin panel, add these routes:
- View all lawyers (approve/reject)
- View all bookings and payments
- Revenue dashboard
- Payout management

---

## 🛣 ROADMAP — NEXT FEATURES TO ADD

- [ ] **WhatsApp notifications** (Twilio / MSG91)
- [ ] **Email notifications** (SendGrid) — booking confirmation, reminders
- [ ] **Payout system** — Auto transfer to lawyer bank accounts via Razorpay
- [ ] **Admin dashboard** — Full revenue and user management panel
- [ ] **Document upload** — Client uploads case documents (Cloudinary)
- [ ] **Real-time chat** — Socket.io between client and lawyer
- [ ] **Mobile app** — React Native app (iOS + Android)
- [ ] **Blog / SEO** — Legal tips content for organic search traffic
- [ ] **Refer & Earn** — Referral program for clients

---

## 🆘 TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| MongoDB error | Atlas → Network Access → Add `0.0.0.0/0` |
| No lawyers showing | Run seed command in browser console |
| Payment not working | Check Razorpay keys in `.env` |
| netlify not found | `npm install -g netlify-cli` |
| Build fails on Netlify | Check environment variables are all set |
| White screen | Check browser console for errors |

---

## ⚡ QUICK COMMANDS

```bash
npm install          # Install all dependencies
netlify dev          # Run locally (port 8888)
npm run build        # Build for production
netlify deploy --prod # Deploy to Netlify
git add . && git commit -m "update" && git push  # Auto-deploy
```

---

**Built for Justice Junction 24/7 ⚖**
*The startup that makes legal help fair, accessible, and transparent for all Indians.*
