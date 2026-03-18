# 🤝 Harambee — Africa's Fundraising Platform

A full-featured M-Changa-style fundraising web app built with React + Vite. Accept donations via M-Pesa, Airtel Money, card, and PayPal.

---

## ✨ Features

- **5 full pages** — Home, Explore, Campaign Detail, Create Fundraiser, Dashboard
- **M-Pesa STK Push UI** — 3-step donate modal with Airtel, Card & PayPal support
- **5-step fundraiser creation** — with photo upload, fee calculator, payout setup
- **Campaign management dashboard** — overview, transactions, settings & withdrawal
- **Search & filter** — by category, verified status, sort by trending/ending/funded
- **Fully responsive** — mobile-first, works on all screen sizes
- **USSD fallback** — `*483*57#` for feature phones
- **Kenyan-first UX** — KES formatting, M-Pesa flows, county fields, local phone inputs

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+ (or yarn / pnpm)

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start the dev server
npm run dev
```

The app will open at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 📁 Project Structure

```
harambee/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                 # Root component & page router
│   ├── main.jsx                # React DOM entry point
│   ├── components/
│   │   ├── Navbar.jsx/css      # Sticky nav with mobile hamburger
│   │   ├── Footer.jsx/css      # Footer with payment badges
│   │   ├── CampaignCard.jsx/css # Reusable campaign card
│   │   └── DonateModal.jsx/css  # M-Pesa / card donate flow
│   ├── pages/
│   │   ├── HomePage.jsx/css    # Landing page
│   │   ├── ExplorePage.jsx/css # Browse & filter campaigns
│   │   ├── CampaignPage.jsx/css # Campaign detail
│   │   ├── CreatePage.jsx/css  # Create a fundraiser
│   │   └── DashboardPage.jsx/css # Manage campaigns
│   ├── data/
│   │   └── campaigns.js        # Mock data (replace with API calls)
│   ├── utils/
│   │   └── helpers.js          # Formatting & utility functions
│   └── styles/
│       └── global.css          # Design tokens & global styles
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── .gitignore
```

---

## 🔌 Connecting Real APIs

### M-Pesa (Safaricom Daraja)
1. Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create an app and get your Consumer Key & Secret
3. Add credentials to `.env`
4. Replace the `handleSubmit` mock in `DonateModal.jsx` with a real STK Push call

### Airtel Money
1. Register at [developers.airtel.africa](https://developers.airtel.africa)
2. Follow the Collections API docs

### Card Payments
- **Flutterwave** (recommended for Kenya): [flutterwave.com](https://flutterwave.com) — install `@flutterwave-dev/flutterwave-react-v3`
- **Stripe**: [stripe.com](https://stripe.com) — install `@stripe/react-stripe-js`

### Backend / Database
This frontend is API-ready. You'll want:
- A backend (Node/Express, Django, Laravel, etc.) for auth, campaign CRUD, and payment webhooks
- A database (PostgreSQL recommended) for campaigns, donors, transactions
- File storage (Cloudinary or S3) for campaign images

---

## 🎨 Design System

All design tokens are CSS variables in `src/styles/global.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--grass` | `#1a7a4a` | Primary green |
| `--sun` | `#f5a623` | Accent amber |
| `--sky` | `#0b7fc7` | Info blue |
| `--ink` | `#0e1a12` | Body text |
| `--sand` | `#fdf6ed` | Light backgrounds |

Fonts: **DM Serif Display** (headings) + **Sora** (labels/buttons) + **DM Sans** (body)

---

## 📱 USSD

The platform supports USSD at `*483*57#` for feature phones. To implement:
- Use Africa's Talking USSD API: [africastalking.com](https://africastalking.com)
- Build a USSD menu flow for create/donate/withdraw

---

## 📄 License

MIT — free to use, modify, and build on.

---

Built with ❤️ for Kenya 🇰🇪
