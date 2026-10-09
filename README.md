# 👑 Style-Rent: Online Luxury Clothing, Formals & Costumes Rental Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Live Website:** [https://ais-pre-bhqatkonulyfu5bb5sbu4s-698741090226.asia-southeast1.run.app](https://ais-pre-bhqatkonulyfu5bb5sbu4s-698741090226.asia-southeast1.run.app)  
> **Direct Documentation PDF:** [Download Project Report PDF](./public/style-rent-project-documentation.pdf)  
> **Printable Viva Report:** [Open HTML Viva Report](./public/project-report.html)

---

## 📖 Project Overview

**Style-Rent** is an e-commerce & quick-commerce web application engineered to solve the acute price-to-utility mismatch of occasion wear. Expensive designer sherwanis, wedding lehengas, 3-piece corporate tuxedos, and theatrical/mythological costumes are rented at a fraction of their retail price (starting from ₹599) with doorstep delivery, hospital-grade sanitization, and flexible rental durations.

### 🌟 Key Functional Highlights

1. **⚡ Flexible Rental Durations:** 1-Day Flash Event (65% base price), 3-Day Weekend Standard, 7-Day Destination Wedding, 10-Day Theatrical Production.
2. **🚀 2-Hour SOS Emergency Delivery:** Hyperlocal dispatch with +₹299 surcharge for urgent wardrobe emergencies.
3. **👑 StylePass Royalty Club (0% Deposit):** Subscription tiers (Silver, Gold, Black) waiving refundable security deposits (₹2,000–₹5,000).
4. **📍 Live Doorstep GPS Delivery Tracker:** Real-time animated simulation showing rider distance, ETA, vehicle speed, and secure 4-digit OTP.
5. **🛡️ 100% Medical-Grade Eco-Dry Cleaning:** Pre-and-post rental sanitization with 130°C high-pressure steam and tamper-evident sealed bags.
6. **👔 Operations & QA Admin Portal:** Staff portal to manage orders, track dispatches, inspect return conditions, and clear deposits.

---

## 🏗️ System Architecture & Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (SPA) | High-performance interactive UI with sub-second recalculations |
| **Language** | TypeScript ~5.7 | Static typing for products, orders, cart items, and membership plans |
| **Styling & Design** | Tailwind CSS v4 | Royal Indian luxury palette (Maroon `#53101E`, Gold `#C69947`, Sand) |
| **Build Tool** | Vite 6 | Lightning-fast HMR and optimized production bundling |
| **Iconography** | Lucide React | Clean contextual SVG icons across all modules |
| **State & Persistence** | React Hooks & LocalStorage | Offline-resilient cart, wishlist, and active orders state |

---

## 📂 Project Directory Structure

```text
style-rent/
├── index.html                    # HTML entry point with fonts & meta tags
├── package.json                  # Dependencies & npm scripts
├── tsconfig.json                 # TypeScript compiler configurations
├── vite.config.ts                # Vite plugin configurations
│
├── public/                       # Static files and downloads
│   ├── style-rent-project-documentation.pdf # 6-page comprehensive viva report PDF
│   ├── project-report.html       # Print-to-PDF academic project report
│   ├── style-rent-project.zip    # Full bundled ZIP download
│   └── style-rent-source-code.zip# Source-code-only ZIP download
│
└── src/
    ├── main.tsx                  # React 19 application entry
    ├── App.tsx                   # Main state orchestrator (cart, filters, modals)
    ├── index.css                 # Global CSS and Tailwind imports
    ├── types/
    │   └── index.ts              # Data contracts: Product, Order, RentalDuration, Membership
    ├── utils/
    │   └── rentalCalculations.ts # Pricing, duration math, SOS delivery fees, and dates
    ├── data/
    │   └── mockData.ts           # Product catalog, customer reviews, and metro cities
    └── components/
        ├── Navbar.tsx            # Sticky navigation with StylePass and live tracker
        ├── HeroSection.tsx       # Value proposition, trust badges, and hero search
        ├── ProductCard.tsx       # Dynamic multi-duration pricing cards
        ├── ProductDetailModal.tsx# Measurements input, custom tailoring, and date picker
        ├── RentalCalendar.tsx    # Interactive booking calendar
        ├── CartDrawer.tsx        # Slide-over cart with deposit waiver breakdown
        ├── CheckoutModal.tsx     # Speed selection (Standard, Same-Day, 2-Hr SOS) & OTP
        ├── OrderConfirmationModal.tsx # Post-order success screen
        ├── DeliveryTrackerModal.tsx  # Animated live GPS delivery tracker with OTP
        ├── MembershipModal.tsx   # StylePass Royalty Club subscription tiers
        ├── AdminDashboard.tsx    # Staff portal: Orders, Dispatches, and Return QA
        ├── WishlistDrawer.tsx    # Saved outfits drawer
        ├── ShareModal.tsx        # Public link sharing, QR code, and ZIP/PDF downloads
        ├── HowItWorksSection.tsx # 4-step rental process guide
        ├── ReviewsSection.tsx    # Verified renter reviews
        └── Footer.tsx            # Quick links, city coverage, and download links
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (version 9 or higher)

### Installation & Run

```bash
# 1. Clone the repository or extract the ZIP
git clone https://github.com/wizardred188/style-rent.git
cd style-rent

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` (or the port indicated in your console) to preview the application.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🎓 Group of 4 Presentation Guide (5-7 Minutes)

- **Member 1 (Introduction & Problem Statement):** Explains the idle luxury clothing problem, circular fashion model, and core value proposition.
- **Member 2 (User Catalog & Custom Tailoring):** Demonstrates dynamic 1-day/3-day pricing, date picker calendar, and bespoke measurement inputs.
- **Member 3 (Quick Commerce & Live GPS Tracker):** Demonstrates the checkout flow, 2-Hour SOS delivery option (+₹299), 4-digit OTP, and live rider simulation.
- **Member 4 (StylePass Royalty Club & Admin Operations):** Explains the 0% deposit membership mechanism, unit economics (ROI in 9 rentals), and staff fulfillment QA portal.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
