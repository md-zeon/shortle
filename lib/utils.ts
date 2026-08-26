import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function detectDevice(userAgent: string | null): string {
  if (!userAgent) return "Unknown";
  if (/mobile|android|iphone|ipod/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

export function detectBrowser(userAgent: string | null): string {
  if (!userAgent) return "Unknown";
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) return "Chrome";
  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  if (/edg/i.test(userAgent)) return "Edge";
  return "Other";
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const COUNTRY_NAMES: Record<string, string> = {
  AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AR: "Argentina", AM: "Armenia",
  AU: "Australia", AT: "Austria", AZ: "Azerbaijan", BD: "Bangladesh", BY: "Belarus",
  BE: "Belgium", BO: "Bolivia", BA: "Bosnia", BR: "Brazil", BG: "Bulgaria",
  KH: "Cambodia", CM: "Cameroon", CA: "Canada", CL: "Chile", CN: "China",
  CO: "Colombia", CR: "Costa Rica", HR: "Croatia", CU: "Cuba", CZ: "Czechia",
  DK: "Denmark", DO: "Dominican Rep.", EC: "Ecuador", EG: "Egypt", SV: "El Salvador",
  EE: "Estonia", FI: "Finland", FR: "France", GE: "Georgia", DE: "Germany",
  GH: "Ghana", GR: "Greece", GT: "Guatemala", HN: "Honduras", HK: "Hong Kong",
  HU: "Hungary", IS: "Iceland", IN: "India", ID: "Indonesia", IR: "Iran",
  IQ: "Iraq", IE: "Ireland", IL: "Israel", IT: "Italy", JM: "Jamaica",
  JP: "Japan", JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya", KW: "Kuwait",
  LV: "Latvia", LT: "Lithuania", LU: "Luxembourg", MY: "Malaysia", MX: "Mexico",
  MD: "Moldova", MN: "Mongolia", MA: "Morocco", MM: "Myanmar", NP: "Nepal",
  NL: "Netherlands", NZ: "New Zealand", NI: "Nicaragua", NG: "Nigeria", MK: "North Macedonia",
  NO: "Norway", OM: "Oman", PK: "Pakistan", PA: "Panama", PY: "Paraguay",
  PE: "Peru", PH: "Philippines", PL: "Poland", PT: "Portugal", QA: "Qatar",
  RO: "Romania", RU: "Russia", SA: "Saudi Arabia", RS: "Serbia", SG: "Singapore",
  SK: "Slovakia", SI: "Slovenia", ZA: "South Africa", KR: "South Korea", ES: "Spain",
  LK: "Sri Lanka", SE: "Sweden", CH: "Switzerland", TW: "Taiwan", TZ: "Tanzania",
  TH: "Thailand", TN: "Tunisia", TR: "Turkey", UG: "Uganda", UA: "Ukraine",
  AE: "United Arab Emirates", GB: "United Kingdom", US: "United States", UY: "Uruguay",
  UZ: "Uzbekistan", VE: "Venezuela", VN: "Vietnam", YE: "Yemen", ZW: "Zimbabwe",
};

export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code.toUpperCase()] || code;
}
