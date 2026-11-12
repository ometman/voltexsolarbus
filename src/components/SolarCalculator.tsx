"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Zap, BatteryCharging, Sun, ShoppingCart, MessageCircle, CalendarCheck } from "lucide-react";
import {
  APPLIANCE_PRESETS,
  calculateSolarSizing,
  type ApplianceInput,
} from "@/lib/solar-sizing";
import type { ElectricalPhaseType } from "@/data/catalog";
import { formatGhs, buildWhatsAppUrl } from "@/lib/ghana";
import { useCart } from "@/context/CartContext";

export function SolarCalculator() {
  const { addItem } = useCart();
  const [propertyType, setPropertyType] = useState("Residential Home");
  const [phase, setPhase] = useState<ElectricalPhaseType>("SINGLE_PHASE");
  const [autonomyHours, setAutonomyHours] = useState(10);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const [appliances, setAppliances] = useState<ApplianceInput[]>(() =>
    APPLIANCE_PRESETS.map((p) => ({
      id: p.id,
      quantity:
        p.id === "led-lights" || p.id === "fridge" || p.id === "tv-decoder" ? 1 : 0,
      hoursPerDay: p.defaultHours,
    }))
  );

  const updateAppliance = (
    id: string,
    field: "quantity" | "hoursPerDay",
    value: number
  ) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: Math.max(0, value) } : a))
    );
  };

  const result = useMemo(
    () => calculateSolarSizing(appliances, autonomyHours, phase),
    [appliances, autonomyHours, phase]
  );

  const handleAddBundle = async () => {
    addItem(result.recommendedBundle, 1);
    setSavedNotice("Recommended bundle added to cart.");
    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType,
          phase,
          autonomyHours,
          appliancesJson: appliances.filter((a) => a.quantity > 0),
          totalRunningWatts: result.totalRunningWatts,
          peakSurgeWatts: result.peakSurgeWatts,
          dailyEnergyKwh: result.dailyEnergyKwh,
          recommendedKva: result.recommendedKva,
          recommendedKwh: result.recommendedKwh,
          recommendedSolarKw: result.recommendedSolarKw,
          recommendedBundleId: result.recommendedBundle.id,
        }),
      });
    } catch {
      // non-blocking telemetry
    }
    setTimeout(() => setSavedNotice(null), 2500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Left: Inputs */}
      <div className="space-y-6 lg:col-span-7">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Calculator className="h-5 w-5 text-amber-500" />
            1. Property &amp; Backup Profile
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option>Residential Home</option>
                <option>Pharmacy / Clinic</option>
                <option>Cold Storage / Agro</option>
                <option>Office / Retail Shop</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                ECG / NEDCo Phase
              </label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as ElectricalPhaseType)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="SINGLE_PHASE">Single-Phase (230V)</option>
                <option value="THREE_PHASE">Three-Phase (415V)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Dumsor Backup Target ({autonomyHours} hrs)
              </label>
              <input
                type="range"
                min={4}
                max={24}
                step={2}
                value={autonomyHours}
                onChange={(e) => setAutonomyHours(Number(e.target.value))}
                className="mt-3 w-full accent-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            2. Select Appliances &amp; Daily Usage
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Set quantity and daily runtime hours. Surge factors for compressors &amp; pumps are included automatically.
          </p>

          <div className="mt-4 divide-y divide-slate-100">
            {APPLIANCE_PRESETS.map((preset) => {
              const current = appliances.find((a) => a.id === preset.id)!;
              return (
                <div
                  key={preset.id}
                  className="flex flex-col justify-between gap-3 py-3 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {preset.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {preset.watts}W • {preset.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs text-slate-600">
                      Qty:
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={current.quantity}
                        onChange={(e) =>
                          updateAppliance(preset.id, "quantity", Number(e.target.value))
                        }
                        className="ml-1.5 w-16 rounded-md border border-slate-300 px-2 py-1 text-sm font-semibold"
                      />
                    </label>
                    <label className="text-xs text-slate-600">
                      Hrs/day:
                      <input
                        type="number"
                        min={0}
                        max={24}
                        value={current.hoursPerDay}
                        onChange={(e) =>
                          updateAppliance(
                            preset.id,
                            "hoursPerDay",
                            Number(e.target.value)
                          )
                        }
                        className="ml-1.5 w-16 rounded-md border border-slate-300 px-2 py-1 text-sm font-semibold"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Recommendation */}
      <div className="lg:col-span-5">
        <div className="sticky top-20 rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-lg">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Engineering Sizing Estimate
          </span>
          <h3 className="mt-1 text-xl font-extrabold">
            {result.recommendedBundle.name}
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-900 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Running / Peak
              </div>
              <p className="mt-1 text-base font-bold">
                {result.totalRunningWatts.toLocaleString()}W /{" "}
                {result.peakSurgeWatts.toLocaleString()}W
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                Daily Load
              </div>
              <p className="mt-1 text-base font-bold">{result.dailyEnergyKwh} kWh/day</p>
            </div>

            <div className="rounded-xl bg-slate-900 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <BatteryCharging className="h-3.5 w-3.5 text-emerald-400" />
                Min. LFP Storage
              </div>
              <p className="mt-1 text-base font-bold">{result.recommendedKwh} kWh</p>
            </div>

            <div className="rounded-xl bg-slate-900 p-3.5">
              <div className="text-xs text-slate-400">Est. Monthly Savings</div>
              <p className="mt-1 text-base font-bold text-emerald-400">
                {formatGhs(result.estimatedMonthlySavingsGhs)}/mo
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Turnkey Bundle Price</span>
              <span className="text-2xl font-extrabold text-amber-400">
                {formatGhs(result.recommendedBundle.priceGhs)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Recommended: {result.recommendedKva}kVA Inverter • {result.recommendedSolarKw}kWp Solar Array
            </p>
          </div>

          {savedNotice && (
            <p className="mt-3 rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300">
              {savedNotice}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleAddBundle}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400"
            >
              <ShoppingCart className="h-4 w-4" />
              Add Recommended Bundle to Cart
            </button>

            <Link
              href="/checkout?mode=audit"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <CalendarCheck className="h-4 w-4 text-emerald-400" />
              Book Site Audit First (GHS 400)
            </Link>

            <a
              href={buildWhatsAppUrl(
                `Hello Voltex Solar, my load estimate is ${result.dailyEnergyKwh} kWh/day (${result.totalRunningWatts}W running, ${propertyType}, ${phase}). I'm looking at ${result.recommendedBundle.name}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-600/60 px-4 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-950/50"
            >
              <MessageCircle className="h-4 w-4" />
              Send Sizing to Engineer on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
