# SmartPatrol Website

Professional Next.js website for **CloudGen Technologies — SmartPatrol**.

Includes:

- SEO-ready App Router pages (`metadata`, `sitemap.xml`, `robots.txt`, JSON-LD, `llms.txt`)
- Full **15-solution** CloudGen catalog (workforce, security, CCTV AI, industry apps, custom)
- **Smart Patrol INR packages**: Attendance, Checkpoint, Visitor, Vehicle, Workforce Duo, Gate Duo, Site Ops Suite
- Quote-only: **Smart Patrol Vision AI**, **Industry Suite**, **Custom Build**
- Ticket Complaints Tracking included on every package
- Registration, demo booking, free demo test
- Play Store–style app download page (`com.guards.app`)
- Razorpay checkout (INR) for Smart Patrol packages

## Pricing

Commercial packages live in `lib/solutions.ts` (INR monthly / annual / setup).

## Develop

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Razorpay

Set:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Without keys, checkout runs in **demo mode** and still records the subscription intent.

## Scripts

```bash
npm run build
npm run start
```
