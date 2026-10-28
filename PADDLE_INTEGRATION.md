# Paddle Payment & API Key Integration Guide

## 📋 Overview

This guide explains how the B2B API Center integrates with Paddle for payment processing and automatic API Key generation.

## 🔧 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (ripavid.com)                                      │
│ - B2BApiCenter Component                                    │
│ - Paddle Checkout Modal                                     │
└────────────────────────┬────────────────────────────────────┘
                         │ User selects tier & pays
                         ↓
         ┌───────────────────────────────┐
         │   Paddle Payment Gateway      │
         │   (Checkout modal)            │
         └────────────────┬──────────────┘
                         │ Payment successful
                         ↓
         ┌───────────────────────────────┐
         │ Paddle Webhook Listener       │
         │ (Render Backend)              │
         │ ripavid-api.onrender.com      │
         └────────────────┬──────────────┘
                         │ Generate API Key
                         ↓
         ┌───────────────────────────────┐
         │ Database / Email Service      │
         │ - Store API Key               │
         │ - Send confirmation email     │
         └───────────────────────────────┘
```

## 🚀 Setup Instructions

### 1. Paddle Account Setup

1. Go to [Paddle Dashboard](https://dashboard.paddle.com)
2. Create your Paddle account or sign in
3. Navigate to **Products**
4. Create three products:
   - **Developer Tier**: $29/month (5,000 requests/month)
   - **Pro Tier**: $99/month (50,000 requests/month)
   - **Enterprise Tier**: $299/month (unlimited)

5. Note down each product's ID (format: `pro_xxxxx`)

### 2. Frontend Configuration

Add your Paddle credentials to `.env.local`:

```env
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_paddle_client_token_here
NEXT_PUBLIC_PADDLE_DEVELOPER_PRODUCT_ID=pro_xxxxx
NEXT_PUBLIC_PADDLE_PRO_PRODUCT_ID=pro_xxxxx
NEXT_PUBLIC_PADDLE_ENTERPRISE_PRODUCT_ID=pro_xxxxx
```

- **Client Token**: Get from Paddle Dashboard → **Settings** → **Authentication**
- **Product IDs**: Copy from each product's details page

### 3. Backend Webhook Configuration

#### A. Render Backend Setup

1. Deploy your API backend to [Render](https://render.com)
2. Create webhook endpoint at: `https://ripavid-api.onrender.com/api/paddle/webhook`

#### B. Webhook Handler (Express/Node.js Example)

```typescript
// api/paddle/webhook.ts (Render backend)
import express from 'express';
import crypto from 'crypto';
import { generateApiKey, sendEmailWithApiKey } from './utils';

const router = express.Router();

// Verify Paddle webhook signature
function verifyPaddleSignature(req: any, secret: string): boolean {
  const signature = req.headers['paddle-signature'];
  const body = JSON.stringify(req.body);
  
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return hash === signature;
}

router.post('/paddle/webhook', async (req, res) => {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  
  // Verify webhook authenticity
  if (!verifyPaddleSignature(req, secret!)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  try {
    // Handle successful payment
    if (event.type === 'transaction.completed') {
      const transaction = event.data;
      const customerId = transaction.customer.id;
      const email = transaction.customer.email;
      const productId = transaction.items[0].product_id;
      
      // Map product ID to tier
      const tierMap: Record<string, string> = {
        [process.env.PADDLE_DEVELOPER_ID!]: 'developer',
        [process.env.PADDLE_PRO_ID!]: 'pro',
        [process.env.PADDLE_ENTERPRISE_ID!]: 'enterprise',
      };
      
      const tier = tierMap[productId];
      
      // Generate API Key
      const apiKey = generateApiKey({
        customerId,
        tier,
        email,
      });

      // Store in database
      await db.apiKeys.create({
        customerId,
        email,
        apiKey,
        tier,
        createdAt: new Date(),
        status: 'active',
        requestLimit: getRequestLimit(tier),
      });

      // Send email with API Key
      await sendEmailWithApiKey(email, apiKey, tier);

      // Optional: Webhook notification to frontend
      // This can be used to show success message without page reload
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### 4. Frontend Integration Details

#### B2BApiCenter Component Flow

```typescript
// app/components/B2BApiCenter.tsx

// 1. Load Paddle script on component mount
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
  script.onload = () => {
    window.Paddle.Environment.set('production');
    window.Paddle.Initialize({
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    });
  };
  document.head.appendChild(script);
}, []);

// 2. Handle subscribe button click
const handleSubscribe = (productId: string) => {
  window.Paddle.Checkout.open({
    items: [{ productId, quantity: 1 }],
  });
};

// 3. User completes payment → Paddle webhook fires
// 4. Backend webhook generates API Key
// 5. Email sent to customer with API Key
```

## 📧 Email Template (API Key Confirmation)

```
Subject: Your RipAVid API Key - ${tier} Tier

Hello,

Thank you for subscribing to RipAVid Enterprise API!

Your API Key:
${apiKey}

Tier: ${tier}
Request Limit: ${requestLimit}/month

Get Started:
- Documentation: https://docs.ripavid.com/api
- Dashboard: https://dashboard.ripavid.com
- Support: support@ripavid.com

Best regards,
RipAVid Team
```

## 🔐 Security Best Practices

1. **Never expose API Keys** in frontend code
2. **Verify webhook signatures** on every request
3. **Use HTTPS only** for all transactions
4. **Rotate webhook secrets** regularly
5. **Store API Keys** securely (hashed) in database
6. **Rate limit** API endpoints

## 📊 Testing

### Test Mode (Paddle Sandbox)

```env
# Use sandbox for testing
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

**Test Card Numbers:**
- Visa: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3-digit number

### Test Webhook

Use Paddle's webhook testing tool in Dashboard → **Webhooks** → **Test**

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Paddle checkout not opening | Verify `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` is correct |
| Webhook not triggering | Check webhook URL in Paddle Dashboard |
| API Key not generated | Verify webhook secret matches in backend |
| Email not sent | Check email service configuration |

## 📞 Support Resources

- Paddle Documentation: https://developer.paddle.com/
- Paddle Support: support@paddle.com
- RipAVid API Docs: https://docs.ripavid.com/api
- Render Deployment: https://render.com/docs

## 🔄 Tier Limits

| Tier | Monthly Requests | Response Time | Support | Price |
|------|-------------------|---------------|---------|-------|
| Developer | 5,000 | Standard | Community | $29 |
| Pro | 50,000 | <100ms | Priority | $99 |
| Enterprise | Unlimited | <100ms | 24/7 | $299 |

---

**Last Updated**: October 28, 2024
**Status**: Ready for Production
