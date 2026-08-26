declare module "geoip-lite" {
  interface GeoIpLookup {
    range: [number, number];
    country: string;
    region: string;
    eu: string;
    timezone: string;
    city: string;
    ll: [number, number];
    metro: number;
    area: number;
  }
  function lookup(ip: string): GeoIpLookup | null;
}
