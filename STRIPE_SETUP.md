# Stripe Integration for PostCraft

This document outlines how to set up the Stripe payment integration for PostCraft.

## Prerequisites

1. A Stripe account (you can sign up at [stripe.com](https://stripe.com))
2. A Supabase account with the database tables set up as described below
3. Node.js and npm installed on your development machine

## Setup Instructions

### 1. Set Up Stripe Account

1. Sign up for a Stripe account if you don't have one
2. In your Stripe Dashboard, create two products with recurring prices:
   - Monthly Subscription ($15/month)
   - Annual Subscription ($149/year)
3. Make note of the price IDs for both products (they start with `price_`)
4. Get your Stripe publishable key from the Developers → API keys section

### 2. Set Up Supabase Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);
```

### 3. Set Up Environment Variables

Create a `.env` file at the root of the project with the following variables:

```
# Supabase Config
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Config
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_PRICE_MONTHLY=your_stripe_monthly_price_id
VITE_STRIPE_PRICE_YEARLY=your_stripe_yearly_price_id

# Application Config
VITE_APP_URL=http://localhost:5173
```

Replace the placeholder values with your actual credentials.

### 4. Deploy Supabase Edge Functions

The project includes two Supabase Edge Functions:

- `create-checkout`: Creates a Stripe checkout session
- `stripe-webhook`: Handles webhook events from Stripe

To deploy these functions:

1. Install Supabase CLI if you haven't already
2. Log in to Supabase CLI
3. Run the following commands:

```bash
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

4. Set up secrets for the functions:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_your_stripe_secret_key
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
supabase secrets set STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
supabase secrets set SITE_URL=your_site_url
```

### 5. Set Up Stripe Webhook

1. In your Stripe dashboard, go to Developers → Webhooks
2. Add a webhook endpoint pointing to your Supabase Edge Function URL:
   `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`
3. Subscribe to the following events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Get the webhook signing secret and add it to your Supabase secrets as `STRIPE_WEBHOOK_SECRET`

## Testing

1. Run the application with `npm run dev`
2. Navigate to the pricing page
3. Test the subscription flow using Stripe test cards:
   - Use `4242 4242 4242 4242` for a successful payment
   - Use `4000 0000 0000 0002` for a declined payment

## Production Deployment

Before deploying to production:

1. Replace all test API keys with production keys
2. Update the webhook endpoint URL to point to your production deployment
3. Update the `SITE_URL` in your Supabase secrets to your production URL

## Troubleshooting

If you encounter issues:

1. Check your browser console for errors
2. Verify webhook events in your Stripe dashboard
3. Check Supabase Edge Function logs for errors

For any persisting issues, refer to the Stripe documentation or contact support.
