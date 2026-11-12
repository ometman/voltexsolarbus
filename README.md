# Voltex Solar Ghana Ltd. (`voltexsolarbus`)

E-commerce storefront, interactive solar load calculator, and turnkey engineering deployment platform for **Voltex Solar Ghana Ltd.** (Greater Accra & Ashanti Region).

## Documentation
- [Business & Deployment Plan](solarbus_build_plan.md)
- [Web App Architecture & Roadmap](webapp_build_plan.md)

## Tech Stack
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database & ORM:** PostgreSQL (`solardb`) + Prisma
- **Payments:** Paystack (MTN MoMo, Telecel Cash, AT Money, Pay with Bank Transfer, Cards)

## Branching Workflow
- `main`: Production-ready releases
- `devlopment`: Default integration branch
- `feat/*`: Individual feature branches merged into `devlopment` via PR
