// Gumroad Product Links - Official RipAVid Payment URLs
export const GUMROAD_LINKS = {
  STARTER_MONTHLY: 'https://7760636545235.gumroad.com/l/spvsfb',
  STARTER_YEARLY: 'https://7760636545235.gumroad.com/l/rdvthz',
  PRO_MONTHLY: 'https://7760636545235.gumroad.com/l/faqur',
  PRO_YEARLY: 'https://7760636545235.gumroad.com/l/ytyllv',
  MAX_MONTHLY: 'https://7760636545235.gumroad.com/l/jwogeik',
  MAX_YEARLY: 'https://7760636545235.gumroad.com/l/usjkjb',
} as const;

// Helper function to get correct link based on plan and billing period
export function getGumroadLink(
  plan: 'starter' | 'pro' | 'max',
  billingPeriod: 'monthly' | 'yearly' = 'monthly'
): string {
  const key = `${plan.toUpperCase()}_${billingPeriod.toUpperCase()}` as keyof typeof GUMROAD_LINKS;
  return GUMROAD_LINKS[key] || GUMROAD_LINKS.STARTER_MONTHLY;
}
