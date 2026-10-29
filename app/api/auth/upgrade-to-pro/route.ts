import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/lib/users';

// Explicitly use Node.js runtime (required for file system access)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { userId, subscriptionId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Update user tier to Pro
    const updatedUser = await updateUser(userId, {
      tier: 'pro',
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Upgrade to Pro error:', error);
    return NextResponse.json({ error: 'Failed to upgrade user' }, { status: 500 });
  }
}
