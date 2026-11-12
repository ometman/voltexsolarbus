import { CATALOG_PRODUCTS, type CatalogProduct, type ElectricalPhaseType } from "@/data/catalog";

export interface AppliancePreset {
  id: string;
  name: string;
  watts: number;
  surgeMultiplier: number;
  defaultHours: number;
  category: "Residential" | "SME";
}

export const APPLIANCE_PRESETS: AppliancePreset[] = [
  { id: "led-lights", name: "LED Lights (per 10 bulbs)", watts: 100, surgeMultiplier: 1.0, defaultHours: 8, category: "Residential" },
  { id: "ceiling-fan", name: "Ceiling / Standing Fans", watts: 75, surgeMultiplier: 1.2, defaultHours: 10, category: "Residential" },
  { id: "tv-decoder", name: "TV + DSTV / Router / CCTV", watts: 180, surgeMultiplier: 1.0, defaultHours: 8, category: "Residential" },
  { id: "fridge", name: "Inverter Fridge / Freezer", watts: 220, surgeMultiplier: 2.0, defaultHours: 12, category: "Residential" },
  { id: "chest-freezer", name: "Deep Chest Freezer", watts: 350, surgeMultiplier: 2.5, defaultHours: 12, category: "Residential" },
  { id: "ac-15hp", name: "1.5HP Inverter Air Conditioner", watts: 1150, surgeMultiplier: 1.5, defaultHours: 6, category: "Residential" },
  { id: "borehole-pump", name: "1HP Borehole Water Pump", watts: 750, surgeMultiplier: 3.0, defaultHours: 2, category: "Residential" },
  { id: "pos-office", name: "Office PCs / POS / Printers", watts: 400, surgeMultiplier: 1.1, defaultHours: 9, category: "SME" },
  { id: "pharma-fridge", name: "Pharmacy Vaccine / Cold Fridge", watts: 450, surgeMultiplier: 2.2, defaultHours: 24, category: "SME" },
  { id: "cold-room", name: "SME Cold Room Compressor (3-Phase)", watts: 3500, surgeMultiplier: 2.5, defaultHours: 14, category: "SME" },
];

export interface ApplianceInput {
  id: string;
  quantity: number;
  hoursPerDay: number;
}

export interface SizingResult {
  totalRunningWatts: number;
  peakSurgeWatts: number;
  dailyEnergyKwh: number;
  recommendedKva: number;
  recommendedKwh: number;
  recommendedSolarKw: number;
  estimatedMonthlySavingsGhs: number;
  recommendedBundle: CatalogProduct;
}

const GHANA_PEAK_SUN_HOURS = 4.8;
const LFP_DOD = 0.8;
const BLENDED_GRID_DIESEL_COST_PER_KWH = 3.2; // GHS blended ECG + diesel generator cost

export function calculateSolarSizing(
  inputs: ApplianceInput[],
  autonomyHours: number,
  phase: ElectricalPhaseType
): SizingResult {
  let totalRunningWatts = 0;
  let maxSurgeDelta = 0;
  let dailyWh = 0;

  for (const item of inputs) {
    if (item.quantity <= 0 || item.hoursPerDay <= 0) continue;
    const preset = APPLIANCE_PRESETS.find((p) => p.id === item.id);
    if (!preset) continue;

    const running = preset.watts * item.quantity;
    totalRunningWatts += running;
    const surgeDelta = running * (preset.surgeMultiplier - 1);
    if (surgeDelta > maxSurgeDelta) {
      maxSurgeDelta = surgeDelta;
    }
    dailyWh += running * item.hoursPerDay;
  }

  const peakSurgeWatts = Math.round(totalRunningWatts + maxSurgeDelta);
  const dailyEnergyKwh = Number((dailyWh / 1000).toFixed(2));

  // Inverter sizing with 25% continuous headroom (kVA ~ kW / 0.85 power factor)
  const rawKva = Math.max(3, (totalRunningWatts * 1.25) / 850);
  const recommendedKva = Number(Math.ceil(rawKva * 2) / 2);

  // Battery sizing: portion of daily energy needed during backup autonomy + 80% DoD
  const backupFraction = Math.min(1, Math.max(0.35, autonomyHours / 24));
  const rawBatteryKwh = (dailyEnergyKwh * backupFraction) / LFP_DOD;
  const recommendedKwh = Number(Math.max(5, Math.ceil(rawBatteryKwh / 5) * 5));

  // Solar array sizing for Ghana ~4.8 PSH + 20% system losses
  const recommendedSolarKw = Number(
    Math.max(3, (dailyEnergyKwh * 1.2) / GHANA_PEAK_SUN_HOURS).toFixed(1)
  );

  const bundles = CATALOG_PRODUCTS.filter((p) => p.category === "TURNKEY_BUNDLE");
  let recommendedBundle = bundles[0];

  if (phase === "THREE_PHASE" || recommendedKva > 6 || recommendedSolarKw > 6.5) {
    recommendedBundle =
      bundles.find((b) => b.sku === "VTX-BND-SME12K") ?? bundles[bundles.length - 1];
  } else if (recommendedKva > 3.5 || recommendedKwh > 5.5) {
    recommendedBundle =
      bundles.find((b) => b.sku === "VTX-BND-MED5K") ?? bundles[1] ?? bundles[0];
  } else {
    recommendedBundle = bundles.find((b) => b.sku === "VTX-BND-RES3K") ?? bundles[0];
  }

  const estimatedMonthlySavingsGhs = Math.round(
    dailyEnergyKwh * 30 * BLENDED_GRID_DIESEL_COST_PER_KWH
  );

  return {
    totalRunningWatts,
    peakSurgeWatts,
    dailyEnergyKwh,
    recommendedKva,
    recommendedKwh,
    recommendedSolarKw,
    estimatedMonthlySavingsGhs,
    recommendedBundle,
  };
}
