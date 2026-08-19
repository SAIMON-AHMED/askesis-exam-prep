# Stripe Payment Integration - Setup Guide

## Status: ✅ READY FOR DEPLOYMENT

All Stripe backend code is implemented. You just need to update environment variables and deploy.

---

## Step 1: Update Railway Environment Variables

1. Go to **[https://railway.app/dashboard](https://railway.app/dashboard)**
2. Select your **Askesis** project
3. Click on the **Backend** service
4. Go to the **"Variables"** tab
5. Update these 4 variables:

```
STRIPE_SECRET_KEY = sk_live_your_stripe_secret_key_here

STRIPE_PUBLISHABLE_KEY = pk_live_your_stripe_publishable_key_here

STRIPE_WEBHOOK_SECRET = whsec_your_webhook_secret_here

ENVIRONMENT = production

FRONTEND_ORIGIN = https://askesisprep.com
```

6. Click **"Save"** - Railway will auto-redeploy the backend

---

## Step 2: Configure Stripe Webhook Endpoint

1. Go to **[https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)**
2. Click **"Add endpoint"**
3. Enter endpoint URL:
   ```
   https://[RAILWAY_BACKEND_URL]/subscription/webhook
   ```
   (Replace `[RAILWAY_BACKEND_URL]` with your actual backend URL from Railway)

4. Select events to send:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`

5. Click **"Create endpoint"**
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Update `STRIPE_WEBHOOK_SECRET` in Railway Variables (already done above)

---

## Step 3: Update Frontend Environment

**For Production (Vercel):**
1. Go to **[https://vercel.com/dashboard](https://vercel.com/dashboard)**
2. Select **Askesis** project
3. Go to **Settings** → **Environment Variables**
4. Update:
   ```
   NEXT_PUBLIC_API_BASE_URL = https://[RAILWAY_BACKEND_URL]
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_51TJhJUEsIw2HskzqF3LXT4oOLtKSp3523nLUS1MOvndqQDSNR6yQY9G3IC3sivb9Zq929UPUU1HMcQ9N19ZlbZUv00a8lWiQXj
   ```
5. Redeploy: **Deployments** → Select latest → **Redeploy**

**For Local Development:**
File: `frontend/.env.local`
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51TJhJUEsIw2HskzqF3LXT4oOLtKSp3523nLUS1MOvndqQDSNR6yQY9G3IC3sivb9Zq929UPUU1HMcQ9N19ZlbZUv00a8lWiQXj
```

---

## Step 4: Deploy Frontend Domain Changes

Since you updated the domain to `askesisprep.com` in the code:
```bash
cd frontend
git add .
git commit -m "Update to production Stripe keys and domain configuration"
git push origin main
```

Vercel will auto-deploy. Once deployed, the following will be updated:
- ✅ Sitemap points to `askesisprep.com`
- ✅ Robots.txt points to `askesisprep.com`
- ✅ All OpenGraph metadata uses `askesisprep.com`
- ✅ Stripe Publishable Key is live mode

---

## How It Works End-to-End

### Purchase Flow:
1. **User clicks "Unlock Exam - $14.99"** on /exams page
2. Frontend calls `POST /purchases` with `{ exam_id: "sat" }`
3. Backend creates Stripe Checkout Session
4. User is redirected to Stripe Checkout (`checkout.stripe.com`)
5. User enters card details and clicks **Pay**
6. Stripe processes payment and sends webhook: `checkout.session.completed`
7. Backend webhook handler:
   - Extracts user_id and exam_id from session metadata
   - Creates ExamPurchase record in database
   - Sets `payment_provider="stripe"`
8. User is redirected to `/exams/sat?payment=success`
9. Frontend refreshes exam access → Card shows "Owned ✓" badge
10. User can now access all SAT content

### Subscription Flow:
1. User clicks plan on `/subscription` page
2. Frontend calls `/subscription/create-checkout-session`
3. Similar flow to exam purchase
4. On webhook `customer.subscription.created`, backend:
   - Finds/creates Subscription record
   - Sets status to `active`
   - Grants unlimited access to all exams

---

## Testing the Setup

### Local Testing:
```bash
# Start backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Start frontend (in new terminal)
cd frontend
npm run dev

# Frontend should be at http://localhost:3002
# Try purchasing an exam (uses live Stripe keys, but in test mode if available)
```

### Production Testing:
1. Go to `https://askesisprep.com/exams`
2. Logged-in users should see "Unlock X - $14.99" button on locked exams
3. Click button → Redirected to Stripe Checkout
4. Use Stripe test card: `4242 4242 4242 4242` (any future date, any CVC)
5. Complete payment
6. Should redirect to `/exams/sat?payment=success`
7. Exam card should show "Owned ✓" badge

---

## Troubleshooting

### Problem: "Stripe not configured" error
- ✅ Check Railway Variables are updated
- ✅ Restart backend service
- ✅ Check `STRIPE_SECRET_KEY` is not empty

### Problem: Webhook not firing
- ✅ Verify webhook endpoint URL in Stripe dashboard
- ✅ Check webhook signing secret matches `STRIPE_WEBHOOK_SECRET` in Railway
- ✅ Check backend logs for webhook errors

### Problem: Redirect URL wrong after payment
- ✅ Verify `FRONTEND_ORIGIN` in Railway (should be `https://askesisprep.com`)
- ✅ Restart backend after changing FRONTEND_ORIGIN

### Problem: "Invalid webhook signature"
- ✅ Signing secret mismatch: Copy exact secret from Stripe dashboard
- ✅ Make sure webhook secret has `whsec_` prefix

---

## Files Modified

- ✅ `backend/.env` - Updated with live Stripe keys
- ✅ `frontend/.env.local` - Updated with live publishable key
- ✅ `frontend/src/app/sitemap.ts` - Domain updated
- ✅ `frontend/public/robots.txt` - Domain updated
- ✅ `frontend/src/app/layout.tsx` - Domain updated in metadata
- ✅ `frontend/src/app/*/layout.tsx` - All page metadata domains updated

## Backend Implementation Details

**Endpoints:**
- `GET /purchases/catalog` - Public list of purchasable exams
- `GET /purchases/me` - Current user's purchased exams
- `POST /purchases` - Create Stripe Checkout session → returns `{ "checkout_url": "..." }`
- `POST /subscription/webhook` - Stripe webhook handler for both exam purchases and subscriptions

**Database:**
- `ExamPurchase` table stores one-time exam purchases with Stripe payment reference
- `Subscription` table stores recurring subscriptions with Stripe subscription ID

**Security:**
- ✅ Webhook signature verification (Stripe webhook secret required)
- ✅ User authentication required for purchase endpoint
- ✅ User ID verified from JWT token, metadata in checkout session

---

## Next Steps

1. ✅ Copy Railway backend URL
2. ✅ Update Railway environment variables with Stripe keys
3. ✅ Configure Stripe webhook endpoint
4. ✅ Update Vercel environment variables
5. ✅ Deploy frontend code with `git push`
6. ✅ Test purchase flow end-to-end
7. ✅ Submit domain to Google Search Console
8. ✅ Monitor analytics in Stripe dashboard

Once complete, your payment system will be fully operational! 🎉
