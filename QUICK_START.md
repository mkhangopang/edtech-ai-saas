# ⚡ Quick Start Checklist

## ✅ Step-by-Step Setup (15 minutes)

### 1️⃣ Install Dependencies (2 min)

```bash
npm install
```

### 2️⃣ Set Up Supabase (5 min)

- [ ] Create account at https://supabase.com
- [ ] Create new project
- [ ] Copy Project URL and API keys
- [ ] Run SQL from `SUPABASE_SETUP.md`
- [ ] Create `curricula` storage bucket
- [ ] Set storage policies

### 3️⃣ Get API Keys (3 min)

**OpenAI** (recommended):

- [ ] Go to https://platform.openai.com
- [ ] Create API key
- [ ] Add billing method (pay-as-you-go)

**OR Groq** (free alternative):

- [ ] Go to https://console.groq.com
- [ ] Create API key (free tier available)

**Stripe**:

- [ ] Go to https://dashboard.stripe.com
- [ ] Get Publishable and Secret keys
- [ ] Install Stripe CLI for webhook testing

### 4️⃣ Create .env.local (2 min)

```env
# Copy from .env.example and fill in:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
# OR GROQ_API_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5️⃣ Run the App (3 min)

**Terminal 1 - Start Next.js:**

```bash
npm run dev
```

**Terminal 2 - Start Stripe webhook (for testing payments):**

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 6️⃣ Test Everything ✨

Open http://localhost:3000

- [ ] Sign up with email (get 10 free credits)
- [ ] Upload a PDF curriculum
- [ ] Generate a lesson plan or quiz
- [ ] Buy credits (use test card: 4242 4242 4242 4242)
- [ ] Generate more content

---

## 🐛 Common Issues

### "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### "Supabase auth error"

- Check .env.local has correct keys
- Restart dev server: Ctrl+C then `npm run dev`

### "Stripe webhook failed"

- Ensure Stripe CLI is running
- Check webhook secret matches .env.local

### "PDF upload fails"

- Verify storage bucket is named `curricula`
- Check storage policies are set
- Ensure bucket is public

---

## 📦 What You Get

✅ Landing page with pricing
✅ Email + Google OAuth login
✅ Dashboard with credit balance
✅ PDF curriculum upload
✅ AI-powered lesson plan generation
✅ AI-powered quiz generation
✅ Stripe payment integration
✅ Credit purchase (50 for $9, 200 for $29)
✅ Beautiful UI with toast notifications
✅ Full TypeScript types
✅ Production-ready middleware
✅ Secure database with RLS

---

## 🚀 Deploy to Production

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add all .env.local variables in Vercel dashboard
# Update NEXT_PUBLIC_APP_URL to production URL
# Set up production webhook in Stripe dashboard
```

---

## 💡 Tips

- Use Groq for free AI (fast, generous limits)
- OpenAI GPT-4o-mini is cheap and good
- Test with Stripe test mode first
- Keep service role key secret!
- Enable Google OAuth for easier signup

---

## 📞 Need Help?

1. Check README.md for detailed docs
2. Check SUPABASE_SETUP.md for database help
3. Review error messages in browser console
4. Check terminal logs for server errors

---

**You're all set! 🎉 Happy building!**
