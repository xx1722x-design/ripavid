import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/lib/users';
import crypto from 'crypto';

export const runtime = 'nodejs';

interface NOWPaymentsWebhookPayload {
  id: number;
  order_id: string;
  order_description: string;
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  outcome_url?: string;
  success_url: string;
  cancel_url: string;
  is_fixed_rate: boolean;
  is_fee_included: boolean;
  status: string; // 'finished', 'pending', 'expired', 'failed'
}

// Verify HMAC signature from NOWPayments
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto
    .createHmac('sha512', secret)
    .update(payload)
    .digest('hex');
  return hmac === signature;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-nowpayments-sig');
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

    if (!signature || !ipnSecret) {
      console.error('Missing signature or IPN secret');
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Get raw body for signature verification
    const body = await request.text();

    // Verify HMAC signature
    if (!verifyWebhookSignature(body, signature, ipnSecret)) {
      console.warn('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the verified payload
    const payload: NOWPaymentsWebhookPayload = JSON.parse(body);

    // Only process finished payments
    if (payload.status !== 'finished') {
      console.log(`Webhook received with status: ${payload.status}, ignoring`);
      return NextResponse.json({ success: true });
    }

    // Extract userId from order_id (format: ripavid_USERID_TIMESTAMP)
    const orderIdParts = payload.order_id.split('_');
    if (orderIdParts[0] !== 'ripavid' || !orderIdParts[1]) {
      console.error('Invalid order_id format:', payload.order_id);
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const userId = orderIdParts[1];

    // Update user tier to pro
    const updatedUser = await updateUser(userId, {
      tier: 'pro',
    });

    if (!updatedUser) {
      console.error('User not found for userId:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`✓ User ${userId} upgraded to Pro via crypto payment`, {
      orderId: payload.order_id,
      amount: payload.price_amount,
      currency: payload.price_currency,
      paymentId: payload.purchase_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
