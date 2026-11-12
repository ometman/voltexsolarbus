import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getProducts } from "@/lib/products";
import {
  DEPOSIT_PERCENTAGE,
  MOMO_DAILY_LIMITS_GHS,
  SITE_AUDIT_FEE_GHS,
} from "@/lib/ghana";
import { initializePaystackTransaction } from "@/lib/paystack";

const CheckoutSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(9),
  customerEmail: z.string().email().optional().or(z.literal("")),
  region: z.string().min(2),
  address: z.string().min(4),
  ghanaPostGps: z.string().optional(),
  paymentMode: z.enum(["FULL", "MILESTONE", "SITE_AUDIT"]),
  channel: z.enum([
    "MOMO_MTN",
    "MOMO_TELECEL",
    "MOMO_AT",
    "BANK_TRANSFER",
    "CARD",
  ]),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .default([]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please complete all required checkout fields.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const isAuditOnly = data.paymentMode === "SITE_AUDIT";

    if (!isAuditOnly && data.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const catalog = await getProducts();
    let subtotalGhs = 0;
    const resolvedItems: Array<{ productId: string; quantity: number; unitPriceGhs: number }> = [];

    if (!isAuditOnly) {
      for (const item of data.items) {
        const product = catalog.find((p) => p.id === item.productId);
        if (!product) {
          return NextResponse.json(
            { error: `Product ${item.productId} not found.` },
            { status: 400 }
          );
        }
        subtotalGhs += product.priceGhs * item.quantity;
        resolvedItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPriceGhs: product.priceGhs,
        });
      }
    }

    const totalGhs = isAuditOnly ? SITE_AUDIT_FEE_GHS : subtotalGhs;
    const amountDueNowGhs =
      data.paymentMode === "MILESTONE"
        ? Math.round(totalGhs * DEPOSIT_PERCENTAGE)
        : totalGhs;

    const isMomoChannel = data.channel.startsWith("MOMO_");
    if (isMomoChannel && amountDueNowGhs > MOMO_DAILY_LIMITS_GHS.TIER_3_ENHANCED) {
      return NextResponse.json(
        {
          error: `Amount due now (GHS ${amountDueNowGhs.toLocaleString()}) exceeds Bank of Ghana MoMo Tier 3 daily limit (GHS 25,000). Please choose Bank Transfer or 30% Milestone Deposit.`,
        },
        { status: 400 }
      );
    }

    const orderNumber = `VTX-${Date.now().toString().slice(-6)}`;
    const paystackRef = `${orderNumber}-${Math.floor(1000 + Math.random() * 9000)}`;
    const quoteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const milestoneLabel = isAuditOnly
      ? "Engineering Site Audit Fee"
      : data.paymentMode === "MILESTONE"
      ? "30% Booking Deposit"
      : "Full System Payment";

    let persisted = false;
    try {
      await prisma.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          region: data.region,
          address: data.address,
          ghanaPostGps: data.ghanaPostGps || null,
          paymentMode: data.paymentMode,
          subtotalGhs,
          totalGhs,
          quoteExpiresAt,
          ...(resolvedItems.length > 0
            ? {
                items: {
                  create: resolvedItems,
                },
              }
            : {}),
          milestones: {
            create: {
              label: milestoneLabel,
              amountGhs: amountDueNowGhs,
              channel: data.channel,
              paystackRef,
              status: "PENDING",
            },
          },
          ...(isAuditOnly
            ? {
                siteAudits: {
                  create: {
                    customerName: data.customerName,
                    phone: data.customerPhone,
                    region: data.region,
                    address: data.address,
                    ghanaPostGps: data.ghanaPostGps || null,
                  },
                },
              }
            : {}),
        },
      });
      persisted = true;
    } catch {
      // Graceful fallback if solardb is not yet migrated
    }

    const paystackChannels: Array<"mobile_money" | "bank_transfer" | "card"> =
      data.channel === "BANK_TRANSFER"
        ? ["bank_transfer"]
        : data.channel === "CARD"
        ? ["card"]
        : ["mobile_money"];

    const init = await initializePaystackTransaction({
      email: data.customerEmail || "orders@voltexsolar.com.gh",
      amountGhs: amountDueNowGhs,
      reference: paystackRef,
      channels: paystackChannels,
      metadata: {
        orderNumber,
        paymentMode: data.paymentMode,
        customerPhone: data.customerPhone,
        region: data.region,
      },
    });

    return NextResponse.json({
      orderNumber,
      amountDueNowGhs,
      totalGhs,
      persisted,
      authorizationUrl: init.authorizationUrl,
      reference: init.reference,
      simulated: init.simulated,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
