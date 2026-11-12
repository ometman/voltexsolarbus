import crypto from "crypto";

export interface PaystackInitParams {
  email: string;
  amountGhs: number;
  reference: string;
  channels: Array<"mobile_money" | "bank_transfer" | "card">;
  metadata: Record<string, unknown>;
}

export interface PaystackInitResult {
  authorizationUrl: string;
  reference: string;
  simulated: boolean;
}

export async function initializePaystackTransaction(
  params: PaystackInitParams
): Promise<PaystackInitResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!secret || secret === "sk_test_replace_me") {
    return {
      authorizationUrl: `${siteUrl}/checkout?status=simulated_success&ref=${encodeURIComponent(
        params.reference
      )}`,
      reference: params.reference,
      simulated: true,
    };
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountGhs * 100), // Paystack expects pesewas
      currency: "GHS",
      reference: params.reference,
      channels: params.channels,
      callback_url: `${siteUrl}/checkout?status=callback&ref=${encodeURIComponent(
        params.reference
      )}`,
      metadata: params.metadata,
    }),
  });

  const data = (await res.json()) as {
    status: boolean;
    message?: string;
    data?: { authorization_url: string; reference: string };
  };

  if (!res.ok || !data.status || !data.data) {
    throw new Error(data.message || "Paystack initialization failed");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
    simulated: false,
  };
}

export function verifyPaystackSignature(
  rawBody: string,
  signature: string | null
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;

  const expected = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
}
