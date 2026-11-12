import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CalculationSchema = z.object({
  customerName: z.string().optional(),
  phone: z.string().optional(),
  region: z.string().default("Greater Accra"),
  propertyType: z.string(),
  phase: z.enum(["SINGLE_PHASE", "THREE_PHASE"]),
  autonomyHours: z.number().int().min(2).max(24),
  appliancesJson: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().min(0),
      hoursPerDay: z.number().min(0).max(24),
    })
  ),
  totalRunningWatts: z.number().int().min(0),
  peakSurgeWatts: z.number().int().min(0),
  dailyEnergyKwh: z.number().min(0),
  recommendedKva: z.number().min(0),
  recommendedKwh: z.number().min(0),
  recommendedSolarKw: z.number().min(0),
  recommendedBundleId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CalculationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid load calculation payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    try {
      const saved = await prisma.loadCalculation.create({
        data: parsed.data,
      });
      return NextResponse.json({ id: saved.id, persisted: true }, { status: 201 });
    } catch {
      return NextResponse.json(
        { id: `calc-${Date.now()}`, persisted: false },
        { status: 201 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
