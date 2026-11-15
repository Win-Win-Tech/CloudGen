# SmartPatrol Website

Professional Next.js website for **CloudGen Technologies — SmartPatrol**.

Includes:

- SEO-ready App Router pages (`metadata`, `sitemap.xml`, `robots.txt`, JSON-LD, `llms.txt`)
- Full **15-solution** CloudGen catalog (workforce, security, CCTV AI, industry apps, custom)
- **USD solution packages**: Essentials / Operations / Vision AI / Industry Apps / Enterprise
- QRPatrol-style **Base / Pro / Gold** pricing with guard-count slider (EUR list · INR checkout)
- Registration, demo booking, free demo test
- Play Store–style app download page (`com.guards.app`)
- Razorpay subscription checkout (INR) for guard plans

## Pricing

- **USD packages** — competitive monthly / annual / setup fees in `lib/solutions.ts`
- **Guard plans** — Base / Pro / Gold amounts follow the published [QR-Patrol pricelist](https://www.qrpatrol.com/pricing) (EUR), including tier totals and ~15% annual discount

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

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve production build
