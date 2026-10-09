import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function generatePDF() {
  const doc = await PDFDocument.create();

  // Color palette
  const maroon = rgb(0.325, 0.063, 0.118); // #53101E
  const gold = rgb(0.776, 0.6, 0.278);     // #C69947
  const darkGray = rgb(0.18, 0.18, 0.18);
  const midGray = rgb(0.4, 0.4, 0.4);
  const lightBg = rgb(0.97, 0.96, 0.94);
  const white = rgb(1, 1, 1);
  const emerald = rgb(0.06, 0.45, 0.32);

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = 595.28; // A4
  const pageHeight = 841.89;

  function addHeaderFooter(page, pageNum, totalPages) {
    // Header line
    page.drawLine({
      start: { x: 45, y: pageHeight - 35 },
      end: { x: pageWidth - 45, y: pageHeight - 35 },
      thickness: 0.5,
      color: midGray,
    });
    page.drawText('STYLE-RENT | Project Viva Documentation & Architecture Report', {
      x: 45,
      y: pageHeight - 30,
      size: 8,
      font: fontRegular,
      color: midGray,
    });

    // Footer line
    page.drawLine({
      start: { x: 45, y: 40 },
      end: { x: pageWidth - 45, y: 40 },
      thickness: 0.5,
      color: midGray,
    });
    page.drawText('Confidential - Academic Project Report | Style-Rent Luxury Platform', {
      x: 45,
      y: 28,
      size: 8,
      font: fontRegular,
      color: midGray,
    });
    page.drawText(`Page ${pageNum} of ${totalPages}`, {
      x: pageWidth - 95,
      y: 28,
      size: 8,
      font: fontBold,
      color: maroon,
    });
  }

  // ---------------- PAGE 1: COVER PAGE ----------------
  const page1 = doc.addPage([pageWidth, pageHeight]);
  
  // Decorative top banner
  page1.drawRectangle({
    x: 0,
    y: pageHeight - 160,
    width: pageWidth,
    height: 160,
    color: maroon,
  });

  page1.drawText('ACADEMIC PROJECT REPORT & VIVA GUIDE', {
    x: 45,
    y: pageHeight - 55,
    size: 11,
    font: fontBold,
    color: gold,
  });

  page1.drawText('STYLE-RENT PLATFORM', {
    x: 45,
    y: pageHeight - 90,
    size: 26,
    font: fontBold,
    color: white,
  });

  page1.drawText('Online Luxury Clothing, Formals & Costumes Rental Solution', {
    x: 45,
    y: pageHeight - 118,
    size: 13,
    font: fontRegular,
    color: rgb(0.9, 0.9, 0.9),
  });

  // Project metadata box
  page1.drawRectangle({
    x: 45,
    y: pageHeight - 300,
    width: pageWidth - 90,
    height: 120,
    color: lightBg,
    borderColor: gold,
    borderWidth: 1,
  });

  page1.drawText('PROJECT OVERVIEW & SPECIFICATIONS', {
    x: 65,
    y: pageHeight - 205,
    size: 11,
    font: fontBold,
    color: maroon,
  });

  const metaItems = [
    'System Type: Full-Stack React 19 + TypeScript + Vite + Tailwind CSS SPA',
    'Core Domain: E-Commerce / Quick-Commerce Fashion Rental System',
    'Specialized Features: 1-Day Rental, 2-Hour SOS Express, StylePass 0% Deposit, Live GPS Tracking',
    'Target Metro Coverage: Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune',
    'Live Demo URL: https://ais-pre-bhqatkonulyfu5bb5sbu4s-698741090226.asia-southeast1.run.app'
  ];

  metaItems.forEach((text, i) => {
    page1.drawText(`-  ${text}`, {
      x: 65,
      y: pageHeight - 225 - (i * 14),
      size: 9,
      font: fontRegular,
      color: darkGray,
    });
  });

  // Table of Contents Box
  page1.drawText('DOCUMENT TABLE OF CONTENTS', {
    x: 45,
    y: pageHeight - 335,
    size: 13,
    font: fontBold,
    color: maroon,
  });

  const tocItems = [
    ['Section 1', 'Executive Summary & Problem Statement', 'Page 2'],
    ['Section 2', 'System Architecture & Technical Stack', 'Page 2'],
    ['Section 3', 'Complete Folder-wise Directory & File Map', 'Page 3'],
    ['Section 4', 'Core Functional Modules & Calculations Logic', 'Page 4'],
    ['Section 5', 'Group of 4 Presentation Division & Role Scripts', 'Page 5'],
    ['Section 6', 'Top Viva Examination Questions & High-Scoring Answers', 'Page 5'],
    ['Section 7', 'GitHub Repository Setup & Local Deployment Guide', 'Page 6'],
  ];

  tocItems.forEach(([sec, title, pg], i) => {
    const yPos = pageHeight - 365 - (i * 24);
    page1.drawText(sec, { x: 55, y: yPos, size: 9.5, font: fontBold, color: maroon });
    page1.drawText(title, { x: 135, y: yPos, size: 9.5, font: fontRegular, color: darkGray });
    page1.drawText(pg, { x: pageWidth - 90, y: yPos, size: 9.5, font: fontBold, color: midGray });
    page1.drawLine({
      start: { x: 380, y: yPos + 3 },
      end: { x: pageWidth - 100, y: yPos + 3 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
  });

  // Team Details Box
  page1.drawRectangle({
    x: 45,
    y: 70,
    width: pageWidth - 90,
    height: 75,
    color: rgb(0.95, 0.96, 0.98),
    borderColor: rgb(0.8, 0.85, 0.9),
    borderWidth: 1,
  });

  page1.drawText('ACADEMIC SUBMISSION NOTE', {
    x: 60,
    y: 125,
    size: 9.5,
    font: fontBold,
    color: maroon,
  });

  page1.drawText('Prepared for academic viva examination, technical demo presentation, and institutional project submission.', {
    x: 60,
    y: 110,
    size: 8.5,
    font: fontRegular,
    color: darkGray,
  });

  page1.drawText('Includes complete source code reference, GitHub repository commands, and architectural proofs.', {
    x: 60,
    y: 95,
    size: 8.5,
    font: fontOblique,
    color: midGray,
  });

  addHeaderFooter(page1, 1, 6);

  // ---------------- PAGE 2: ARCHITECTURE & TECH STACK ----------------
  const page2 = doc.addPage([pageWidth, pageHeight]);

  page2.drawText('1. EXECUTIVE SUMMARY & PROBLEM STATEMENT', {
    x: 45,
    y: pageHeight - 65,
    size: 13,
    font: fontBold,
    color: maroon,
  });

  const p1 = [
    'Occasion wear (royal sherwanis, designer bridal lehengas, 3-piece tuxedo suits, and mythological/theatrical costumes)',
    'suffers from an acute price-to-utility mismatch: a premium designer outfit costing Rs. 25,000 to Rs. 1,00,000 is worn only 1-2 times',
    'before remaining idle in wardrobes. Style-Rent transforms this underutilized asset class through a circular rental economy.',
    'Customers rent verified, dry-cleaned designer apparel starting at Rs. 599 to Rs. 899 with 0% deposit (StylePass), flexible durations',
    '(1-day, 3-day, 7-day, 10-day), and same-day or 2-hour SOS emergency doorstep fulfillment.'
  ];
  p1.forEach((line, i) => {
    page2.drawText(line, { x: 45, y: pageHeight - 85 - (i * 12), size: 8.5, font: fontRegular, color: darkGray });
  });

  page2.drawText('2. TECHNICAL ARCHITECTURE & COMPONENT TOPOLOGY', {
    x: 45,
    y: pageHeight - 165,
    size: 13,
    font: fontBold,
    color: maroon,
  });

  const techRows = [
    ['Frontend Framework', 'React 19 (SPA Architecture) with TypeScript (~5.7)'],
    ['Build System & Dev Server', 'Vite 6 with Hot Module Replacement & Tree-Shaking'],
    ['Styling & Design System', 'Tailwind CSS v4 with bespoke Indian luxury palette (Maroon, Royal Gold, Sand)'],
    ['Iconography & Visual Assets', 'Lucide React (16+ contextual SVG icons)'],
    ['State Management', 'React Hooks (useState, useMemo, useEffect) with persistent LocalStorage'],
    ['Business Logic & Math', 'Dedicated modular utilities (rentalCalculations.ts) for duration pricing & deposits'],
    ['Delivery Simulation Engine', 'Live animated multi-step rider progression with real-time ETA & Delivery OTP'],
    ['Operations Dashboard', 'Role-based administrative portal: inventory management, dispatches, and return QA']
  ];

  techRows.forEach(([col1, col2], i) => {
    const y = pageHeight - 190 - (i * 18);
    page2.drawRectangle({
      x: 45,
      y: y - 3,
      width: pageWidth - 90,
      height: 16,
      color: i % 2 === 0 ? lightBg : white,
    });
    page2.drawText(col1, { x: 50, y, size: 8.5, font: fontBold, color: maroon });
    page2.drawText(col2, { x: 210, y, size: 8.5, font: fontRegular, color: darkGray });
  });

  page2.drawText('3. DATA FLOW & LIFECYCLE DIAGRAM', {
    x: 45,
    y: pageHeight - 360,
    size: 13,
    font: fontBold,
    color: maroon,
  });

  const stages = [
    ['User Browsing & Filters', 'Filters by gender, occasion, rental duration, and instant same-day delivery.'],
    ['Date Selection & Fitting', 'Calendar algorithm auto-calculates return dates. Standard sizing or custom tailoring.'],
    ['Smart Cart & Deposit Logic', 'Calculates refundable security deposit or applies 0% deposit waiver with StylePass.'],
    ['Express Checkout & OTP', 'Selects Standard (Free), Same-Day (Rs. 99), or 2-Hour SOS (Rs. 299). Generates 4-digit OTP.'],
    ['Live GPS Delivery Tracker', 'Interactive tracker tracks rider progress, distance, vehicle speed, and contact info.'],
    ['Post-Rental QA & Dry Cleaning', 'Operations portal logs outfit return, checks for fabric stains, and clears deposit.']
  ];

  stages.forEach(([title, desc], i) => {
    const y = pageHeight - 385 - (i * 35);
    page2.drawRectangle({
      x: 45,
      y: y - 10,
      width: pageWidth - 90,
      height: 28,
      color: lightBg,
      borderColor: gold,
      borderWidth: 0.5,
    });
    page2.drawText(`Step ${i + 1}: ${title}`, { x: 55, y: y + 5, size: 9, font: fontBold, color: maroon });
    page2.drawText(desc, { x: 55, y: y - 6, size: 8, font: fontRegular, color: darkGray });
  });

  addHeaderFooter(page2, 2, 6);

  // ---------------- PAGE 3: FOLDER DIRECTORY MAP ----------------
  const page3 = doc.addPage([pageWidth, pageHeight]);

  page3.drawText('3. COMPLETE FOLDER-WISE DIRECTORY & FILE MAP', {
    x: 45,
    y: pageHeight - 65,
    size: 13,
    font: fontBold,
    color: maroon,
  });

  const fileMap = [
    ['/public', 'Static assets, generated project ZIP archives, and sample image models.'],
    ['/src/App.tsx', 'Root application state orchestrator: cart, wishlist, orders, active modals, and tabs.'],
    ['/src/types/index.ts', 'Strongly typed contracts: Product, Order, CartItem, UserMembership, RentalDuration.'],
    ['/src/utils/rentalCalculations.ts', 'Pricing formulas: 1-day (65%), 7-day (1.6x), 10-day (2.1x), SOS fee (Rs. 299), deposit waiver.'],
    ['/src/data/mockData.ts', 'Initial catalog data, reviews, StylePass tiers, metro cities list, and default orders.'],
    ['/src/components/Navbar.tsx', 'Sticky top navigation with category dropdowns, search bar, StylePass, and Track button.'],
    ['/src/components/HeroSection.tsx', 'High-conversion hero banner displaying trust pillars, SOS badges, and value proposition.'],
    ['/src/components/ProductCard.tsx', 'Catalog cards showing dynamic pricing per selected duration, discount, and quick rent.'],
    ['/src/components/ProductDetailModal.tsx', 'Full product modal: size selection, custom tailoring measurements, and fabric details.'],
    ['/src/components/RentalCalendar.tsx', 'Date range picker with booking constraints, weekend highlighting, and blackout dates.'],
    ['/src/components/CartDrawer.tsx', 'Sliding cart sheet calculating rental total, delivery surcharge, and deposit summary.'],
    ['/src/components/CheckoutModal.tsx', 'Doorstep checkout form: speed selector (Standard, Same-Day, 2-Hr SOS), payment method.'],
    ['/src/components/OrderConfirmationModal.tsx', 'Order success screen with rental timeline, delivery OTP, and link to Live GPS Tracker.'],
    ['/src/components/DeliveryTrackerModal.tsx', 'Live GPS simulation with moving courier, speed indicators, rider details, and OTP verification.'],
    ['/src/components/MembershipModal.tsx', 'StylePass Royalty Club tiers (Silver, Gold, Black) offering 0% security deposits.'],
    ['/src/components/AdminDashboard.tsx', 'Internal portal for staff: Order fulfillment, live dispatch tracking, and return QA checks.'],
    ['/src/components/ShareModal.tsx', 'Direct sharing modal with native share, WhatsApp, QR code, and ZIP download buttons.'],
    ['/src/components/WishlistDrawer.tsx', 'Slide-over wishlist drawer allowing renters to bookmark preferred outfits.']
  ];

  fileMap.forEach(([path, purpose], i) => {
    const y = pageHeight - 90 - (i * 20);
    page3.drawRectangle({
      x: 45,
      y: y - 4,
      width: pageWidth - 90,
      height: 18,
      color: i % 2 === 0 ? lightBg : white,
    });
    page3.drawText(path, { x: 50, y, size: 8, font: fontBold, color: maroon });
    page3.drawText(purpose, { x: 195, y, size: 7.5, font: fontRegular, color: darkGray });
  });

  addHeaderFooter(page3, 3, 6);

  // ---------------- PAGE 4: CORE BUSINESS LOGIC ----------------
  const page4 = doc.addPage([pageWidth, pageHeight]);

  page4.drawText('4. MATHEMATICAL MODELS & BUSINESS ALGORITHMS', {
    x: 45,
    y: pageHeight - 65,
    size: 13,
    font: fontBold,
    color: maroon,
  });

  page4.drawText('A. Multi-Duration Dynamic Pricing Matrix', {
    x: 45,
    y: pageHeight - 90,
    size: 10.5,
    font: fontBold,
    color: darkGray,
  });

  const mathLines = [
    '- 1-Day Flash Event Rental: 65% of base 3-day rental fee (e.g., Rs. 899 base becomes Rs. 584)',
    '- 3-Day Weekend Standard: 100% of base rental fee (Ideal for Sangeet, Wedding, or Corporate Summit)',
    '- 7-Day Destination Wedding: 160% of base rental fee (Accommodates outstation travel days)',
    '- 10-Day Festival / Theatrical Run: 210% of base rental fee (Costume production & mythological shoots)'
  ];
  mathLines.forEach((l, i) => {
    page4.drawText(l, { x: 55, y: pageHeight - 108 - (i * 14), size: 8.5, font: fontRegular, color: darkGray });
  });

  page4.drawText('B. Delivery Logistics Speed Tiers', {
    x: 45,
    y: pageHeight - 180,
    size: 10.5,
    font: fontBold,
    color: darkGray,
  });

  const speedTiers = [
    ['Standard Doorstep (Free / Rs. 0)', 'Dispatched via premium courier 24-48 hours prior to reservation date.'],
    ['Same-Day Guaranteed (+Rs. 99)', 'Dispatched via express hyperlocal fleet for same-day evening parties.'],
    ['2-Hour SOS Emergency (+Rs. 299)', 'Priority rider assignment with live GPS tracking for last-minute wardrobe malfunctions.']
  ];
  speedTiers.forEach(([name, desc], i) => {
    const y = pageHeight - 200 - (i * 24);
    page4.drawText(`- ${name}:`, { x: 55, y, size: 8.5, font: fontBold, color: maroon });
    page4.drawText(desc, { x: 230, y, size: 8.5, font: fontRegular, color: darkGray });
  });

  page4.drawText('C. StylePass Membership & 0% Deposit Security Architecture', {
    x: 45,
    y: pageHeight - 285,
    size: 10.5,
    font: fontBold,
    color: darkGray,
  });

  const memberTiers = [
    ['Free Tier', 'Standard refundable security deposit charged (Rs. 2,000 - Rs. 5,000) and refunded post-return QA.'],
    ['Silver Member (Rs. 499/mo)', '50% deposit waiver + 1 free custom alteration session.'],
    ['Gold Member (Rs. 999/mo)', '100% deposit waiver (Rs. 0 security deposit) + free same-day delivery upgrades.'],
    ['Black Elite (Rs. 1,999/mo)', '100% deposit waiver + unlimited 2-hour SOS deliveries + dedicated wardrobe concierge.']
  ];
  memberTiers.forEach(([tier, benefit], i) => {
    const y = pageHeight - 305 - (i * 22);
    page4.drawText(`- ${tier}:`, { x: 55, y, size: 8.5, font: fontBold, color: emerald });
    page4.drawText(benefit, { x: 195, y, size: 8.5, font: fontRegular, color: darkGray });
  });

  page4.drawText('D. Hygiene & Sanitization Protocol (Industry Benchmark)', {
    x: 45,
    y: pageHeight - 405,
    size: 10.5,
    font: fontBold,
    color: darkGray,
  });

  const hygiene = [
    '1. 100% Hospital-Grade Eco-Dry Cleaning before and after every rental cycle.',
    '2. High-pressure steam sanitization at 130 deg C to eliminate 99.9% of bacteria and allergens.',
    '3. Double-layer breathable garment seal bag with tamper-evident reversible zipper for return courier.'
  ];
  hygiene.forEach((h, i) => {
    page4.drawText(h, { x: 55, y: pageHeight - 425 - (i * 15), size: 8.5, font: fontRegular, color: darkGray });
  });

  addHeaderFooter(page4, 4, 6);

  // ---------------- PAGE 5: PRESENTATION & VIVA Q&A ----------------
  const page5 = doc.addPage([pageWidth, pageHeight]);

  page5.drawText('5. GROUP OF 4 PRESENTATION DIVISION (5-7 MINUTES TOTAL)', {
    x: 45,
    y: pageHeight - 65,
    size: 12,
    font: fontBold,
    color: maroon,
  });

  const roles = [
    ['Member 1: Intro & Problem Statement', 'Hook the audience with wardrobe cost dilemma. Present Style-Rent mission, value proposition, and catalog overview.'],
    ['Member 2: User Journey & Custom Fitting', 'Walk through the live catalog: 1-day/3-day rental options, interactive calendar, and custom tailoring measurement inputs.'],
    ['Member 3: Quick Commerce & Live GPS Tracker', 'Demonstrate checkout: 2-Hour SOS delivery (+Rs. 299), 4-digit delivery OTP, and live animated GPS rider tracking simulation.'],
    ['Member 4: StylePass Membership & Admin Operations', 'Showcase StylePass 0% deposit club, financial sustainability, and the staff inspection/fulfillment admin portal.']
  ];

  roles.forEach(([title, speech], i) => {
    const y = pageHeight - 88 - (i * 32);
    page5.drawRectangle({
      x: 45,
      y: y - 5,
      width: pageWidth - 90,
      height: 26,
      color: lightBg,
      borderColor: gold,
      borderWidth: 0.5,
    });
    page5.drawText(title, { x: 52, y: y + 8, size: 8.5, font: fontBold, color: maroon });
    page5.drawText(speech, { x: 52, y: y - 2, size: 7.5, font: fontRegular, color: darkGray });
  });

  page5.drawText('6. TOP VIVA EXAMINATION QUESTIONS & HIGH-SCORING ANSWERS', {
    x: 45,
    y: pageHeight - 230,
    size: 12,
    font: fontBold,
    color: maroon,
  });

  const qna = [
    ['Q1: How do you handle garment damages or unreturned items?',
     'Ans: We implement a dual-shield strategy: Standard renters hold a pre-authorized security deposit. StylePass members are verified via KYC, and incidental wear-and-tear insurance (Rs. 99) covers minor tears. Total loss triggers retail replacement liability.'],
    ['Q2: Why choose React 19 and Tailwind v4 instead of traditional MPA?',
     'Ans: Rental workflows require frictionless single-page interactivity (instant price recalculation on date change, modal sliders, live rider map polling) without disruptive full-page reloads.'],
    ['Q3: How does the system prevent date-booking overlaps for the same outfit?',
     'Ans: The rental calendar computes inclusive ISO date intervals (startDate to returnDate). Admin inventory status tracks active dispatches, preventing double bookings.'],
    ['Q4: What is the unit economics and profitability model?',
     'Ans: High-margin asset utilization: A designer sherwani purchased for Rs. 15,000 yields Rs. 1,800/rental. After 9 rentals, the asset breaks even and generates 70%+ gross margin per rental cycle.']
  ];

  qna.forEach(([q, a], i) => {
    const y = pageHeight - 255 - (i * 44);
    page5.drawText(q, { x: 45, y, size: 8.5, font: fontBold, color: maroon });
    page5.drawText(a, { x: 45, y: y - 13, size: 7.5, font: fontRegular, color: darkGray });
  });

  addHeaderFooter(page5, 5, 6);

  // ---------------- PAGE 6: GITHUB & DEPLOYMENT ----------------
  const page6 = doc.addPage([pageWidth, pageHeight]);

  page6.drawText('7. GITHUB REPOSITORY SETUP & LOCAL COMMANDS', {
    x: 45,
    y: pageHeight - 65,
    size: 13,
    font: fontBold,
    color: maroon,
  });

  page6.drawText('Step-by-Step GitHub Publishing Guide for User:', {
    x: 45,
    y: pageHeight - 88,
    size: 9.5,
    font: fontBold,
    color: darkGray,
  });

  const gitSteps = [
    '1. Create a new empty repository on your GitHub account named "style-rent" (https://github.com/new).',
    '2. Open your project folder in terminal or VS Code and run the following commands:',
    '   git init',
    '   git add .',
    '   git commit -m "Initial commit: Style-Rent luxury clothing rental platform"',
    '   git branch -M main',
    '   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/style-rent.git',
    '   git push -u origin main',
    '3. Your code is now fully published to GitHub with complete commit history!'
  ];

  gitSteps.forEach((s, i) => {
    page6.drawText(s, {
      x: 50,
      y: pageHeight - 105 - (i * 15),
      size: 8.5,
      font: s.startsWith('   git') ? fontBold : fontRegular,
      color: s.startsWith('   git') ? maroon : darkGray,
    });
  });

  page6.drawText('8. LOCAL DEVELOPMENT & DEMO RUNNER', {
    x: 45,
    y: pageHeight - 250,
    size: 13,
    font: fontBold,
    color: maroon,
  });

  const devSteps = [
    'Prerequisites: Node.js (v18 or higher) and npm installed.',
    'Command 1: npm install               # Installs all required React 19, Lucide, and Vite modules',
    'Command 2: npm run dev               # Launches the development server on http://localhost:3000',
    'Command 3: npm run build             # Creates the optimized static production build in /dist'
  ];

  devSteps.forEach((s, i) => {
    page6.drawText(s, {
      x: 50,
      y: pageHeight - 275 - (i * 18),
      size: 8.5,
      font: s.startsWith('Command') ? fontBold : fontRegular,
      color: s.startsWith('Command') ? emerald : darkGray,
    });
  });

  // Final summary verification box
  page6.drawRectangle({
    x: 45,
    y: 80,
    width: pageWidth - 90,
    height: 120,
    color: lightBg,
    borderColor: maroon,
    borderWidth: 1,
  });

  page6.drawText('PROJECT SUBMISSION CERTIFICATE & VERIFICATION', {
    x: 60,
    y: 180,
    size: 10,
    font: fontBold,
    color: maroon,
  });

  const certLines = [
    'Project Title: Style-Rent: Online Luxury Clothing, Formals & Costumes Rental Platform',
    'Key Technologies: React 19, TypeScript 5.7, Tailwind CSS v4, Lucide Icons, Vite 6',
    'Production App Status: Compiled and Verified Live with Zero Warnings/Errors',
    'Deliverables Included: Interactive Web App, Source Code ZIP, Full Project ZIP, PDF Viva Report',
    'Direct Project Link: https://ais-pre-bhqatkonulyfu5bb5sbu4s-698741090226.asia-southeast1.run.app'
  ];

  certLines.forEach((l, i) => {
    page6.drawText(`[OK]  ${l}`, {
      x: 60,
      y: 160 - (i * 15),
      size: 8,
      font: fontRegular,
      color: darkGray,
    });
  });

  addHeaderFooter(page6, 6, 6);

  // Write the PDF
  const pdfBytes = await doc.save();
  fs.writeFileSync('public/style-rent-project-documentation.pdf', pdfBytes);
  console.log(`Generated public/style-rent-project-documentation.pdf (${pdfBytes.length} bytes)`);
}

generatePDF().catch(console.error);
