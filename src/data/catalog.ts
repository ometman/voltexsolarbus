export type ProductCategoryType =
  | "SOLAR_PANEL"
  | "HYBRID_INVERTER"
  | "BATTERY_STORAGE"
  | "TURNKEY_BUNDLE"
  | "ACCESSORY";

export type ElectricalPhaseType = "SINGLE_PHASE" | "THREE_PHASE";

export interface CatalogProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategoryType;
  description: string;
  priceGhs: number;
  wattage: number | null;
  capacityKwh: number | null;
  phase: ElectricalPhaseType | null;
  efficiencyPct: number | null;
  liRegulation: string | null;
  ecRegNumber: string | null;
  imageUrl: string;
  warrantyYears: number;
  stockAccra: number;
  stockKumasi: number;
  featured: boolean;
  specs: Record<string, string>;
}

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "prod-jinko-580w",
    sku: "VTX-PNL-JK580",
    slug: "jinko-tiger-neo-580w-bifacial",
    name: "Jinko Tiger Neo 580W N-Type Bifacial Solar Panel",
    brand: "JinkoSolar",
    category: "SOLAR_PANEL",
    description:
      "Tier-1 N-Type TOPCon monocrystalline bifacial module engineered for high ambient heat in Greater Accra and Ashanti. Exceeds Ghana Energy Commission L.I. 2449 (>= 21% efficiency) requirements.",
    priceGhs: 2150,
    wattage: 580,
    capacityKwh: null,
    phase: null,
    efficiencyPct: 22.45,
    liRegulation: "L.I. 2449",
    ecRegNumber: "EC-RE-2449-JK580",
    imageUrl: "/images/products/solar-panel.jpg",
    warrantyYears: 25,
    stockAccra: 48,
    stockKumasi: 16,
    featured: true,
    specs: {
      "Cell Type": "N-Type Mono TOPCon Bifacial",
      "Max Power (Pmax)": "580 W",
      "Module Efficiency": "22.45%",
      "Temp Coefficient": "-0.29%/°C",
      "Dimensions": "2278 x 1134 x 30 mm",
    },
  },
  {
    id: "prod-longi-550w",
    sku: "VTX-PNL-LG550",
    slug: "longi-hi-mo-5-550w-mono",
    name: "LONGi Hi-MO 5 550W Monocrystalline Panel",
    brand: "LONGi",
    category: "SOLAR_PANEL",
    description:
      "High-yield half-cut PERC module with anti-PID protection and strong low-light performance during Harmattan haze.",
    priceGhs: 1950,
    wattage: 550,
    capacityKwh: null,
    phase: null,
    efficiencyPct: 21.3,
    liRegulation: "L.I. 2449",
    ecRegNumber: "EC-RE-2449-LG550",
    imageUrl: "/images/products/solar-panel.jpg",
    warrantyYears: 25,
    stockAccra: 36,
    stockKumasi: 12,
    featured: false,
    specs: {
      "Cell Type": "P-Type Mono PERC Half-Cut",
      "Max Power (Pmax)": "550 W",
      "Module Efficiency": "21.30%",
      "IP Rating": "IP68 Junction Box",
    },
  },
  {
    id: "prod-deye-5kw",
    sku: "VTX-INV-DY5K",
    slug: "deye-5kw-hybrid-inverter-1ph",
    name: "Deye 5kW Single-Phase Hybrid Inverter (SUN-5K-SG03LP1)",
    brand: "Deye",
    category: "HYBRID_INVERTER",
    description:
      "Pure sine wave 48V hybrid inverter with dual MPPT, anti-islanding protection, Wi-Fi IoT telemetry, and ECG/NEDCo 50Hz/230V net-metering readiness.",
    priceGhs: 14800,
    wattage: 5000,
    capacityKwh: null,
    phase: "SINGLE_PHASE",
    efficiencyPct: 97.6,
    liRegulation: "L.I. 2461",
    ecRegNumber: "EC-RE-2461-DY5K",
    imageUrl: "/images/products/hybrid-inverter.jpg",
    warrantyYears: 5,
    stockAccra: 14,
    stockKumasi: 5,
    featured: true,
    specs: {
      "Grid Output": "230V AC, 50Hz Single-Phase",
      "Battery Voltage": "48V LiFePO4 / Lead-Acid",
      "Max PV Input": "6,500 W (2 MPPTs)",
      "Protection": "IP65 + Anti-Islanding",
    },
  },
  {
    id: "prod-deye-12kw-3p",
    sku: "VTX-INV-DY12K3P",
    slug: "deye-12kw-3phase-hybrid-inverter",
    name: "Deye 12kW 3-Phase Hybrid Inverter (SUN-12K-SG04LP3)",
    brand: "Deye",
    category: "HYBRID_INVERTER",
    description:
      "Commercial 415V three-phase hybrid inverter built for pharmacies, cold storage, and SME offices with 100% unbalanced load support.",
    priceGhs: 32500,
    wattage: 12000,
    capacityKwh: null,
    phase: "THREE_PHASE",
    efficiencyPct: 97.6,
    liRegulation: "L.I. 2461",
    ecRegNumber: "EC-RE-2461-DY12K",
    imageUrl: "/images/products/hybrid-inverter.jpg",
    warrantyYears: 5,
    stockAccra: 6,
    stockKumasi: 2,
    featured: false,
    specs: {
      "Grid Output": "400V/415V AC, 50Hz Three-Phase",
      "Battery Voltage": "48V Low-Voltage LFP",
      "Max PV Input": "15,600 W",
      "Parallel Support": "Up to 10 units",
    },
  },
  {
    id: "prod-felicity-5kwh",
    sku: "VTX-BAT-FL5K",
    slug: "felicity-5kwh-lifepo4-battery",
    name: "Felicity Solar 5.12kWh 48V LiFePO4 Battery Pack",
    brand: "Felicity Solar",
    category: "BATTERY_STORAGE",
    description:
      "L.I. 2452 compliant Lithium Iron Phosphate battery with active smart BMS, 6,000+ cycle life @ 80% DoD, and CAN/RS485 inverter communication.",
    priceGhs: 13900,
    wattage: null,
    capacityKwh: 5.12,
    phase: null,
    efficiencyPct: 95.0,
    liRegulation: "L.I. 2452",
    ecRegNumber: "EC-RE-2452-FL5K",
    imageUrl: "/images/products/lifepo4-battery.jpg",
    warrantyYears: 7,
    stockAccra: 18,
    stockKumasi: 7,
    featured: true,
    specs: {
      "Chemistry": "LiFePO4 (LFP)",
      "Nominal Energy": "5.12 kWh (51.2V 100Ah)",
      "Cycle Life": "6,000+ cycles @ 80% DoD",
      "BMS": "Active Smart BMS + Breaker",
    },
  },
  {
    id: "prod-felicity-10kwh",
    sku: "VTX-BAT-FL10K",
    slug: "felicity-10kwh-lifepo4-battery",
    name: "Felicity Solar 10.24kWh 48V LiFePO4 Wall/Rack Battery",
    brand: "Felicity Solar",
    category: "BATTERY_STORAGE",
    description:
      "High-capacity LFP storage module ideal for overnight AC and fridge backup during extended ECG outages.",
    priceGhs: 26500,
    wattage: null,
    capacityKwh: 10.24,
    phase: null,
    efficiencyPct: 95.0,
    liRegulation: "L.I. 2452",
    ecRegNumber: "EC-RE-2452-FL10K",
    imageUrl: "/images/products/lifepo4-battery.jpg",
    warrantyYears: 7,
    stockAccra: 10,
    stockKumasi: 4,
    featured: false,
    specs: {
      "Chemistry": "LiFePO4 (LFP)",
      "Nominal Energy": "10.24 kWh (51.2V 200Ah)",
      "Cycle Life": "6,000+ cycles @ 80% DoD",
      "Communication": "CAN / RS485",
    },
  },
  {
    id: "prod-bundle-res-3kva",
    sku: "VTX-BND-RES3K",
    slug: "voltex-essential-home-3kva-5kwh-bundle",
    name: "Voltex Essential Home 3kVA / 5kWh Turnkey Bundle",
    brand: "Voltex Solar",
    category: "TURNKEY_BUNDLE",
    description:
      "Complete residential starter kit: 3kVA Pure Sine Hybrid Inverter + 3kW Jinko Panels + 5.12kWh LiFePO4 Battery + Aluminum Rail Mounting & DC Protection. 3.5–4 yr payback.",
    priceGhs: 42500,
    wattage: 3000,
    capacityKwh: 5.12,
    phase: "SINGLE_PHASE",
    efficiencyPct: 22.0,
    liRegulation: "L.I. 2449 / 2452 / 2461",
    ecRegNumber: "EC-RE-BND-3K",
    imageUrl: "/images/products/turnkey-bundle.svg",
    warrantyYears: 5,
    stockAccra: 8,
    stockKumasi: 3,
    featured: true,
    specs: {
      "Inverter": "3kVA Hybrid Pure Sine (50Hz)",
      "Solar Array": "3.0 kWp Tier-1 Monocrystalline",
      "Battery": "5.12 kWh LiFePO4 with BMS",
      "Est. Payback": "3.5 – 4 Years",
      "Includes": "Mounting Rails, SPD, Earthing & Commissioning",
    },
  },
  {
    id: "prod-bundle-med-5kva",
    sku: "VTX-BND-MED5K",
    slug: "voltex-comfort-home-5kva-10kwh-bundle",
    name: "Voltex Comfort Home & Office 5kVA / 10kWh Turnkey Bundle",
    brand: "Voltex Solar",
    category: "TURNKEY_BUNDLE",
    description:
      "Runs inverter ACs, deep freezers, lighting, and home office uninterrupted: Deye 5kW Hybrid + 5.2kWp Jinko Bifacial Array + 10.24kWh LiFePO4 Storage + IoT Monitoring.",
    priceGhs: 69500,
    wattage: 5000,
    capacityKwh: 10.24,
    phase: "SINGLE_PHASE",
    efficiencyPct: 22.45,
    liRegulation: "L.I. 2449 / 2452 / 2461",
    ecRegNumber: "EC-RE-BND-5K",
    imageUrl: "/images/products/turnkey-bundle.svg",
    warrantyYears: 5,
    stockAccra: 5,
    stockKumasi: 2,
    featured: true,
    specs: {
      "Inverter": "Deye 5kW Hybrid (Wi-Fi IoT)",
      "Solar Array": "9x 580W Jinko Bifacial (5.22 kWp)",
      "Battery": "10.24 kWh LiFePO4",
      "Est. Payback": "3 – 4 Years",
      "Includes": "Site Survey, Aluminum Rails, Earthing & Commissioning",
    },
  },
  {
    id: "prod-bundle-sme-12kva",
    sku: "VTX-BND-SME12K",
    slug: "voltex-sme-commercial-12kva-3phase-bundle",
    name: "Voltex SME Commercial 12kVA 3-Phase / 15kWh Turnkey Bundle",
    brand: "Voltex Solar",
    category: "TURNKEY_BUNDLE",
    description:
      "Built for pharmacies, cold storage, and retail hubs to slash diesel generator spend: Deye 12kW 3-Phase Hybrid + 11.6kWp Jinko Array + 15.36kWh LFP Storage + Net Metering Readiness.",
    priceGhs: 138000,
    wattage: 12000,
    capacityKwh: 15.36,
    phase: "THREE_PHASE",
    efficiencyPct: 22.45,
    liRegulation: "L.I. 2449 / 2452 / 2461",
    ecRegNumber: "EC-RE-BND-12K",
    imageUrl: "/images/products/turnkey-bundle.svg",
    warrantyYears: 5,
    stockAccra: 3,
    stockKumasi: 1,
    featured: true,
    specs: {
      "Inverter": "Deye 12kW 3-Phase Hybrid (415V)",
      "Solar Array": "20x 580W Jinko Bifacial (11.6 kWp)",
      "Battery": "15.36 kWh Modular LiFePO4",
      "Est. Payback": "2.5 – 3.5 Years",
      "Includes": "3-Phase Engineering Audit, Protection & Net Metering Docs",
    },
  },
];

export const CATEGORY_LABELS: Record<ProductCategoryType, string> = {
  TURNKEY_BUNDLE: "Turnkey Bundles",
  SOLAR_PANEL: "Solar Panels",
  HYBRID_INVERTER: "Hybrid Inverters",
  BATTERY_STORAGE: "LiFePO4 Batteries",
  ACCESSORY: "Accessories",
};
