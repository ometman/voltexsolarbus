import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackSignature } from "@/lib/paystack";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as {
      event: string;
      data?: { reference?: string };
    };

    if (event.event === "charge.success" && event.data?.reference) {
      const ref = event.data.reference;

      const milestone = await prisma.paymentMilestone.findUnique({
        where: { paystackRef: ref },
        include: { order: true },
      });

      if (milestone && milestone.status !== "SUCCESS") {
        await prisma.$transaction([
          prisma.paymentMilestone.update({
            where: { id: milestone.id },
            data: { status: "SUCCESS", paidAt: new Date() },
          }),
          prisma.order.update({
            where: { id: milestone.orderId },
            data: {
              status:
                milestone.order.paymentMode === "SITE_AUDIT"
                  ? "AUDIT_SCHEDULED"
                  : "DEPOSIT_PAID",
            },
          }),
        ]);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing error" }, { status: 400 });
  }
}
