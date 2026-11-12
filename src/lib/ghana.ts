export const MOMO_DAILY_LIMITS_GHS = {
  TIER_1_MIN: 3000,
  TIER_2_MED: 15000,
  TIER_3_ENHANCED: 25000,
} as const;

export const SITE_AUDIT_FEE_GHS = 400;
export const DEPOSIT_PERCENTAGE = 0.3;

export function formatGhs(amount: number): string {
  return `GHS ${amount.toLocaleString("en-GH")}`;
}

export function buildWhatsAppUrl(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "233000000000";
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function requiresBankTransferOrDeposit(totalGhs: number): boolean {
  return totalGhs > MOMO_DAILY_LIMITS_GHS.TIER_2_MED;
}
