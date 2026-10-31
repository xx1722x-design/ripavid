import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/users';
import crypto from 'crypto';

export const runtime = 'nodejs';

interface NOWPaymentsInvoiceRequest {
  price_amount: number;
  price_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url: string;
  success_url?: string;
  cancel_url?: string;
}

interface NOWPaymentsInvoiceResponse {
  invoice_url: string;
  order_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, billingPeriod } = await request.json();

    if (!userId || !billingPeriod) {
      return NextResponse.json(
        { error: 'userId and billingPeriod are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Pricing
    const prices: Record<string, number> = {
      monthly: 4.99,
      yearly: 29.88, // $2.49/month when billed yearly (50% off)
    };

    const price = prices[billingPeriod];
    if (!price) {
      return NextResponse.json(
        { error: 'Invalid billing period' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      console.error('NOWPAYMENTS_API_KEY not configured');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    // Create invoice request
    const orderId = `ripavid_${userId}_${Date.now()}`;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.ripavid.com';

    const invoiceRequest: NOWPaymentsInvoiceRequest = {
      price_amount: price,
      price_currency: 'usd',
      order_id: orderId,
      order_description: `RipaVid Pro Pass - ${billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'} Subscription`,
      ipn_callback_url: `${baseUrl}/api/crypto/webhook`,
      success_url: `${baseUrl}?payment=success`,
      cancel_url: `${baseUrl}?payment=cancelled`,
    };

    // Call NOWPayments API
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(invoiceRequest),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('NOWPayments API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to create payment invoice' },
        { status: response.status }
      );
    }

    const invoiceData: NOWPaymentsInvoiceResponse = await response.json();

    return NextResponse.json({
      success: true,
      invoiceUrl: invoiceData.invoice_url,
      orderId: invoiceData.order_id,
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
