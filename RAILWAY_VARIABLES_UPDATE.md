# Railway Variables Update - Manual Instructions

Your Railway Backend URL: **https://askesis-api-production.up.railway.app**

## Variables to Update in Railway Dashboard

Go to: https://railway.com/project/7775fb00-9011-49d8-9f29-dc3566c2d44c/service/0114a8a0-005c-443e-9c15-f0cb3fc214ec/variables

### 1. ENVIRONMENT
**Current:** (appears to be: development)
**Update to:** `production`
**Action:** Click the ⋮ menu → Edit → Change value → Save

### 2. FRONTEND_ORIGIN
**Current:** (appears to be: http://localhost:3001)
**Update to:** `https://askesisprep.com`
**Action:** Click the ⋮ menu → Edit → Change value → Save

### 3. STRIPE_SECRET_KEY
**Current:** (old test key)
**Update to:** `sk_live_...` (get from Stripe Dashboard → Developers → API keys)
**Action:** Click the ⋮ menu → Edit → Change value → Save

### 4. STRIPE_WEBHOOK_SECRET
**Current:** (old test key)
**Update to:** `whsec_...` (get from Stripe Dashboard → Developers → Webhooks)
**Action:** Click the ⋮ menu → Edit → Change value → Save

### 5. STRIPE_PUBLISHABLE_KEY (if doesn't exist, create new)
**Value:** `pk_live_...` (get from Stripe Dashboard → Developers → API keys)
**Action:** Click "New Variable" button → Enter name: `STRIPE_PUBLISHABLE_KEY` → Paste value → Save

---

## Quick Visual Guide

1. **For existing variables** (ENVIRONMENT, FRONTEND_ORIGIN, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET):
   - Find the variable in the list
   - Click the **⋮ (three dots)** button on the right
   - Select **"Edit"**
   - Clear the current value
   - Paste the new value from above
   - Click **"Save"**

2. **For new variable** (STRIPE_PUBLISHABLE_KEY if missing):
   - Click **"New Variable"** button (blue button at top)
   - Enter: `STRIPE_PUBLISHABLE_KEY`
   - Enter value: `pk_live_51TJhJUEsIw2HskzqF3LXT4oOLtKSp3523nLUS1MOvndqQDSNR6yQY9G3IC3sivb9Zq929UPUU1HMcQ9N19ZlbZUv00a8lWiQXj`
   - Click **"Save"**

3. **After all updates**, Railway automatically redeploys the backend. Wait for the deployment to complete (check the "Deployments" tab).

---

## Stripe Webhook Configuration

After updating Railway variables, configure the webhook in Stripe:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL:** `https://askesis-api-production.up.railway.app/subscription/webhook`
4. **Events to send:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`
5. Click **"Create endpoint"**
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Compare it with `STRIPE_WEBHOOK_SECRET` value above - they should match

---

## Vercel Environment Variables

Once Railway is updated, update Vercel:

1. Go to: https://vercel.com/dashboard
2. Select **Askesis** project
3. Click **Settings** → **Environment Variables**
4. Update:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://askesis-api-production.up.railway.app`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_51TJhJUEsIw2HskzqF3LXT4oOLtKSp3523nLUS1MOvndqQDSNR6yQY9G3IC3sivb9Zq929UPUU1HMcQ9N19ZlbZUv00a8lWiQXj`
5. Click **"Save"**
6. Go to **Deployments** tab → Select latest → **"Redeploy"**

---

## Testing the Setup

Once deployed:

1. Go to **https://askesisprep.com/exams**
2. Log in with your account
3. Click **"Unlock [Exam] - $14.99"** on any locked exam
4. You should be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242` (any future expiry, any CVC)
6. Complete payment
7. Redirected to `/exams/[examId]?payment=success`
8. Exam card should show **"Owned ✓"**

✅ **Setup complete!**

---

## Need Help?

Once you've completed the Railway updates, let me know:
- "✅ Railway variables updated and redeployed"
- "✅ Stripe webhook configured"

Then I'll:
1. Deploy frontend code with git
2. Update Vercel environment variables
3. Test the full payment flow end-to-end
4. Submit to Google Search Console
