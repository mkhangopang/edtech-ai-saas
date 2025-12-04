This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🎓 EdTech AI SaaS - Complete Setup Guide

A production-ready EdTech SaaS platform built with Next.js 14, Supabase, OpenAI/Groq, and Stripe.

## ✨ Features

- 🔐 **Authentication**: Email + Google OAuth with Supabase
- 📄 **PDF Upload**: Secure curriculum storage in Supabase Storage
- 🤖 **AI Generation**: Streaming lesson plans & quizzes with OpenAI/Groq
- 💳 **Credit System**: 10 free credits → pay-as-you-go
- 💰 **Stripe Payments**: $9 for 50 credits, $29 for 200 credits
- 🎨 **Beautiful UI**: Tailwind CSS + Sonner toasts
- 🚀 **Production Ready**: TypeScript, middleware, RLS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: OpenAI GPT-4 or Groq Llama 3.1
- **Payments**: Stripe Checkout + Webhooks
- **Notifications**: Sonner

## 📦 Installation

### 1. Clone & Install Dependencies

```bash
# Install dependencies
npm install

# Or if you prefer yarn
yarn install
```

### 2. Set Up Supabase

Follow the complete guide in **SUPABASE_SETUP.md**:

- Create Supabase project
- Run SQL schema
- Set up storage bucket
- Configure OAuth (optional)

### 3. Set Up Environment Variables

Create `.env.local` in the root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI (choose one)
OPENAI_API_KEY=your_openai_api_key

# OR Groq (alternative)
# GROQ_API_KEY=your_groq_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Stripe

#### Get Stripe Keys:

1. Go to https://dashboard.stripe.com
2. Get your **Publishable key** and **Secret key** from Developers > API keys
3. Add them to `.env.local`

#### Set Up Products (Optional):

1. Go to Products in Stripe Dashboard
2. Create two products:
   - **Starter Pack**: $9 for 50 credits
   - **Pro Pack**: $29 for 200 credits
3. Copy the Price IDs and update `app/dashboard/credits/page.tsx`

#### Set Up Webhook:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
3. Copy the webhook secret to `.env.local`
4. For production, add webhook endpoint in Stripe Dashboard

### 5. Get OpenAI or Groq API Key

#### OpenAI:

1. Go to https://platform.openai.com
2. Create API key
3. Add to `.env.local`

#### Groq (Free Alternative):

1. Go to https://console.groq.com
2. Create API key
3. Update `app/api/generate/route.ts` to use Groq
4. Add key to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Update NEXT_PUBLIC_APP_URL to your production URL
```

### Set Up Production Webhook

1. In Vercel, get your production URL
2. In Stripe Dashboard:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhook`
   - Select events: `checkout.session.completed`, `checkout.session.expired`
   - Copy webhook secret to Vercel environment variables

## 📁 Project Structure

```
edtech-ai-saas/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts      # Stripe checkout
│   │   ├── generate/route.ts      # AI generation
│   │   └── webhook/route.ts       # Stripe webhook
│   ├── auth/callback/route.ts     # OAuth callback
│   ├── dashboard/
│   │   ├── page.tsx               # Dashboard
│   │   ├── generate/page.tsx      # AI generation UI
│   │   └── credits/
│   │       ├── page.tsx           # Buy credits
│   │       └── success/page.tsx   # Payment success
│   ├── login/page.tsx             # Login page
│   ├── signup/page.tsx            # Signup page
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── lib/
│   └── supabase/client.ts         # Supabase client
├── middleware.ts                  # Auth middleware
├── .env.local                     # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── SUPABASE_SETUP.md             # Database setup
└── README.md                      # This file
```

## 🔧 Configuration

### Switch from OpenAI to Groq

In `app/api/generate/route.ts`:

```typescript
// Comment out OpenAI
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || '',
// })

// Uncomment Groq
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
});

// Change model
model: "llama-3.1-70b-versatile"; // instead of 'gpt-4o-mini'
```

### Customize Credit Prices

In `app/dashboard/credits/page.tsx`, update the `packages` array:

```typescript
const packages: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    price: 9, // Change price here
    priceId: "price_xxx", // Your Stripe price ID
  },
  // ...
];
```

## 🧪 Testing

### Test Stripe Payments (Locally)

1. Run Stripe webhook listener:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

2. Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC

### Test PDF Upload

1. Create a test PDF with educational content
2. Upload through dashboard
3. Generate lesson plan or quiz

## 📝 Common Issues

### Middleware Authentication Errors

- Ensure `.env.local` has correct Supabase keys
- Restart dev server after changing env variables

### Stripe Webhook Not Working

- Check webhook secret matches
- Ensure webhook listener is running (local)
- Verify endpoint URL (production)

### PDF Upload Fails

- Check Supabase Storage policies
- Verify bucket name is `curricula`
- Ensure file is under 10MB

### AI Generation Not Streaming

- Check API key is valid
- Verify model name is correct
- Check network tab for errors

## 🎯 Features Roadmap

- [ ] PDF text extraction with pdf-parse
- [ ] Save generated content to database
- [ ] Export to PDF/Word
- [ ] Team collaboration
- [ ] Analytics dashboard
- [ ] Custom AI models
- [ ] White-label support

## 📄 License

MIT License - feel free to use for your own projects!

## 🤝 Support

Need help? Open an issue or reach out!

---

Built with ❤️ using Next.js, Supabase, and OpenAI
