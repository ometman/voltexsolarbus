# Web App Storefront & Operations Plan: Voltex Solar Ghana Ltd.

**Objective:** Build a fast, mobile-first, conversion-focused e-commerce and solar engineering platform tailored to Ghana’s energy market, payment rails (MoMo + Bank Transfer), and Energy Commission regulations (`L.I. 2449`, `L.I. 2452`, `L.I. 2461`).

---

## 1. Product & UX Strategy: Hybrid E-Commerce + Consultative Sales

Unlike standard retail, solar systems in Ghana cost **GHS 35,000 – GHS 170,000+** and require roof, shading, and electrical load verification. A pure "Add to Cart → Full Checkout" model will fail for high-ticket orders. The web app must support **three distinct conversion paths**:

1. **Direct Buy (Components & Accessories):** Individual panels, inverters, batteries, surge protectors, and DC breakers. Supports full checkout via **Paystack Bank Transfer**, **Cards**, or **Mobile Money** (within BoG wallet limits).
2. **Turnkey Bundle + Site Audit / Deposit Flow:** Customers size their system, then pay a **Site Audit Fee (e.g., GHS 300–500)** or a **20%–30% Booking Deposit** via MoMo to lock in hardware pricing and schedule an engineer visit.
3. **SME & Green Financing Flow:** For 15kVA–100kVA+ commercial setups or installment buyers, customers generate a **Pro-Forma Invoice (PDF)** or submit a **Financing Pre-Qualification** form directly from the load calculator.

---

## 2. Recommended Tech Stack

Optimized for **low-bandwidth 3G/4G mobile networks** in Ghana, rapid iteration, and low Phase 1 overhead:

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend & SSR** | **Next.js (App Router, TypeScript)** | React Server Components minimize client JS; fast initial load on cellular networks. |
| **Styling & UI** | **Tailwind CSS + shadcn/ui** | Clean, high-contrast mobile UI; accessible components with minimal bundle size. |
| **Database & ORM** | **PostgreSQL (Supabase) + Prisma** | Relational integrity for orders, multi-hub stock, payment milestones, and serial/IMEI logs. |
| **Auth** | **Supabase Auth** (Email + Phone/OTP) | Supports Customer, Field Engineer, and Admin role-based access control (RBAC). |
| **Payments** | **Paystack** (Primary) + **Flutterwave** (Backup) | Native support for MTN MoMo, Telecel Cash, AT Money, **Pay with Bank Transfer**, and Cards. |
| **Messaging** | **WhatsApp Business API + Termii/Hubtel SMS** | Ghanaian customers rely on WhatsApp & SMS far more than email for order & audit updates. |
| **File Storage** | **Supabase Storage / Cloudflare R2** | Hosts Energy Commission compliance PDFs, site-audit photos, and generated invoices. |
| **Hosting & CDN** | **Vercel** (or Cloudflare Pages) | Edge caching for static catalog pages and datasheets. |

---

## 3. Core Platform Modules

### A. Public Storefront & Product Catalog
* **Product Categories:**
  * Solar Panels (Monocrystalline / Bifacial 450W–650W)
  * Hybrid Inverters (Single-phase & Three-phase, 50Hz/230V/415V)
  * LiFePO4 Battery Storage (Modular racks & wall-mount)
  * Complete Turnkey Bundles (Small Residential, Medium/Light SME, Commercial SME)
  * Balance-of-System (Mounting rails, DC isolators, SPDs, PV cables)
* **Product Detail Page (PDP) Essentials:**
  * **Energy Commission Compliance Badge:** Displays registration status under `L.I. 2449`, `L.I. 2452`, or `L.I. 2461` with downloadable compliance/datasheet PDFs.
  * **Stock & Fulfillment Visibility:** Shows availability (*In Stock – Accra*, *2–3 Days Dispatch – Kumasi*, or *Order-to-Ship*).
  * **FX-Protected Pricing:** Displays GHS price (with optional USD reference) and a clear quote-validity window for high-ticket bundles.
  * **WhatsApp Quick-Consult Button:** Pre-fills product SKU and user's location into a WhatsApp chat with sales engineering.

### B. Interactive Solar Load Calculator (`/calculator`)
* **Inputs:**
  * Property type (Residential, Pharmacy, Cold Room, Office/Shop) & Phase (`1-Phase 230V` vs `3-Phase 415V`).
  * Appliance selector with realistic wattages & surge factors (Inverter AC, chest freezer, fridge, borehole pump, lighting, POS/routers).
  * Daily backup / "dumsor" autonomy target (e.g., 4 hrs, 8 hrs, 24/7 off-grid).
* **Outputs:**
  * Recommended Inverter kVA, Battery kWh (with 80% DoD buffer), and Solar Array kWp.
  * Matched Voltex Turnkey Bundle(s) with CapEx range.
  * Estimated monthly ECG + diesel generator savings and payback period.
  * One-click **"Book Site Audit"** or **"Download Pro-Forma Quote (PDF)"**.

### C. Ghana-Aware Checkout & Payment Engine
Because MTN MoMo enforces Bank of Ghana daily limits (**GHS 3,000 Tier 1 / GHS 15,000 Tier 2 / GHS 25,000 Tier 3**), the checkout must prevent failed high-value MoMo attempts:
* **Smart Payment Routing:**
  * **Orders <= GHS 15,000:** Show MTN MoMo, Telecel Cash, AT Money, Bank Transfer, and Card.
  * **Orders > GHS 15,000:** Default to **Pay with Bank Transfer** (Paystack dedicated virtual account) or **Milestone Deposit** (e.g., 30% Deposit now, 50% on hardware delivery, 20% on commissioning).
  * **Explicit Limit Warning:** If a customer selects MoMo on a large cart, display their wallet tier limit and offer split/deposit options.
* **Pro-Forma Invoice Generator:** Lets SMEs and corporate buyers download a stamped PDF quote with TIN, Energy Commission details, and bank transfer instructions.

### D. Customer Portal (`/dashboard`)
* **Order & Installation Tracker:** Live status pipeline (`Audit Booked` → `Audit Completed` → `Hardware Allocated` → `Dispatched` → `Installed & Commissioned`).
* **Warranty & Serial/IMEI Vault:** Lists every installed panel, inverter, and battery with its logged serial/IMEI number, installation date, and warranty expiration.
* **AMC (Annual Maintenance Contract) Manager:** Bi-monthly Harmattan panel-washing schedule, service logs, and 1-click renewal.
* **IoT Monitoring Link:** Direct deep-link/iframe or API summary from the inverter OEM cloud (e.g., Deye/Solarman, Victron VRM) so Voltex avoids reinventing IoT hardware/telemetry in Phase 1.

### E. Admin & Field Operations Portal (`/admin`)
* **Inventory & Serial/IMEI Logger:** Track stock quantities per warehouse and scan/assign serial numbers to specific customer orders upon dispatch.
* **Site Audit Dispatch:** Assign incoming audit requests to field engineers in Greater Accra or Ashanti; engineers upload roof photos, earthing notes, and final BOM adjustments from mobile.
* **Milestone Payment Reconciliation:** Track deposits, Paystack webhooks, and manual bank transfers against each order.
* **Compliance Document Manager:** Upload and attach Energy Commission certificates and datasheets to product SKUs.

---

## 4. Core Database Schema (Prisma / PostgreSQL)

```
User (id, name, phone, email, role: CUSTOMER | ENGINEER | ADMIN, ghanaPostGps)
 ├── SiteAudit (id, userId, engineerId, address, roofType, phase, notes, photos[], status)
 ├── LoadCalculation (id, userId, appliancesJson, totalWatts, dailyKwh, recommendedBundleId)
 └── Order (id, orderNumber, userId, status, totalGhs, paymentMode: FULL | MILESTONE, quoteExpiresAt)
      ├── OrderItem (id, orderId, productId, quantity, unitPriceGhs)
      ├── PaymentMilestone (id, orderId, label, amountGhs, channel, paystackRef, status, paidAt)
      ├── SerialNumberLog (id, orderId, productId, serialOrImei, warrantyMonths, commissionedAt)
      └── AmcSubscription (id, orderId, planTier, nextCleaningDate, status)

Product (id, sku, name, category, wattage, voltage, ecRegNumber, liRegulation, datasheetUrl, priceGhs, active)
 └── WarehouseStock (id, productId, hub: ACCRA | KUMASI | PARTNER, quantity)
```

---

## 5. Security, Compliance & Reliability Checklist

* **Webhook Verification:** Validate all Paystack/Flutterwave webhooks using HMAC SHA-512 (`x-paystack-signature`) and enforce idempotency keys on `PaymentMilestone` records.
* **Server-Side Price Integrity:** Never trust cart totals from the client; recalculate prices and bundle discounts on the server at checkout.
* **Ghana Data Protection Act (Act 843):** Encrypt/protect customer PII (phone numbers, GhanaPost GPS addresses, financing docs) and include clear privacy/consent terms.
* **Offline-Resilient Field Forms:** Ensure the engineer site-audit form caches inputs locally in the browser (`localStorage`/IndexedDB) in case of poor cellular signal on rooftops.

---

## 6. Phased Implementation Roadmap (12 Weeks)

### Phase 1: MVP Storefront, Calculator & Audit Booking (Weeks 1–4)
* Next.js + Tailwind + Supabase project setup and core Prisma schema.
* Product catalog + PDPs with Energy Commission `L.I. 2449/2452/2461` badges and downloadable datasheets.
* Interactive Solar Load Calculator.
* Paystack integration for **Site Audit Fees** (MoMo) + **WhatsApp** sales handoff.

### Phase 2: Full Checkout, Bank Transfer & Operations Admin (Weeks 5–8)
* Full cart & checkout with **Pay with Bank Transfer**, **Milestone Deposits**, and **Pro-Forma PDF** generation.
* Paystack webhook handler + automated WhatsApp/SMS order confirmations.
* Admin dashboard: order management, serial/IMEI logging, and engineer audit assignment.

### Phase 3: Customer Portal, AMC & Financing (Weeks 9–12)
* Customer dashboard with live installation tracker and digital warranty/serial vault.
* Recurring **AMC** (bi-monthly Harmattan cleaning) subscription billing.
* Green Financing pre-qualification workflow (document upload + partner bank/MFI routing).
* Multi-hub stock visibility (Accra + Kumasi).
