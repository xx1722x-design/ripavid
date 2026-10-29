import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateUser, getUserByEmail } from '@/lib/users';

// Explicitly use Node.js runtime (required for crypto and file system access)
export const runtime = 'nodejs';

// Verify Paddle webhook signature
function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('paddle-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const rawBody = await request.text();
    const secret = process.env.PADDLE_WEBHOOK_SECRET || '';

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(rawBody);

    // Handle subscription creation/update events
    if (data.type === 'subscription.created' || data.type === 'subscription.updated') {
      const email = data.data?.customer_data?.email;
      const subscriptionId = data.data?.id;
      const status = data.data?.status;

      if (!email) {
        return NextResponse.json({ error: 'No email in webhook' }, { status: 400 });
      }

      // Find user by email and update tier
      const user = await getUserByEmail(email);

      if (user) {
        // Only upgrade if subscription is active
        if (status === 'active' || status === 'trialing') {
          await updateUser(user.uid, {
            tier: 'pro',
          });
        }
      }

      return NextResponse.json({ success: true });
    }

    // Handle subscription cancellation
    if (data.type === 'subscription.canceled') {
      const email = data.data?.customer_data?.email;

      if (email) {
        const user = await getUserByEmail(email);
        if (user) {
          await updateUser(user.uid, {
            tier: 'free',
          });
        }
      }

      return NextResponse.json({ success: true });
    }

    // Return success for other event types to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Paddle webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
