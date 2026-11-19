# स्वाद मोहल्ला (Swad Mohalla) — Prototype
*Rasoi Se Rojgar Tak — BUILDHER BHARAT 2026*

A clear, accessible, and connected prototype web application designed for low-literacy home cooks, customers, and autonomous Dabbawala delivery partners.

---

## 🌟 Key Prototype Features

### 1. 🔀 Role Picker (Landing Page)
- 3 clear, high-contrast, visual cards with large icons and voice assistance:
  - 🛒 **ग्राहक (Customer / Food Lover)**
  - 👩‍🍳 **रसोई (Merchant / Home Chef)**
  - 🛵 **डिलीवरी साथी (Delivery Partner)**
- Fast switcher in the top navigation allows toggling between roles instantly to test the complete loop.

### 2. 🛒 Customer Flow (`ग्राहक`)
- **Visual Menu:** Browse authentic thalis, pickles (achar), and papad with portion availability indicators.
- **Cart & Mohalla Slot:** Add items to cart with simple +/- controls and choose delivery slot/zone.
- **Simulated UPI Checkout:** Realistic UPI modal (PhonePe / Google Pay / Paytm) with instant QR mock.
- **Dabbawala Tag & OTP:** Orders receive an official tag code (e.g. `SM-12-B-4`) and a 4-digit Delivery OTP to give to the delivery partner upon arrival.

### 3. 👩‍🍳 Merchant Flow (`रसोई / होम शेफ`)
- **Storefront Toggle:** Single-click kitchen open/close switch.
- **Finance Saathi Mini Ledger:** Real-time calculation of today's sales, active orders, and estimated net profit.
- **Order Pipeline:** Accept new orders $\to$ Mark "Cooking" $\to$ Mark "Packed" (generates pickup OTP for the delivery partner).
- **Add New Dish:** Clean form to add new meals, set price, and specify daily portion limits (instantly reflected on customer menu).

### 4. 🛵 Delivery Partner Flow (`डिलीवरी साथी`)
- **Zone Selector:** Select neighborhood zone (Zone A: Gandhi Nagar, Zone B: Shastri Nagar, Zone C: Model Town).
- **Earnings & Trips:** Live wallet tracker (₹35 per dabba).
- **Order Acceptance:** Accept pending runs freely.
- **Dual OTP Verification:**
  - Enter pickup OTP provided by the home cook.
  - Deliver to customer and enter customer's delivery OTP for instant payout confirmation.

---

## 🚀 Running the App

```bash
cd C:\Users\sonam\.gemini\antigravity\scratch\swad-mohalla
npm install
npm run dev
```

Server runs live at: **http://localhost:5173/**
