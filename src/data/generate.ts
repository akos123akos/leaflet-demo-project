import L from 'leaflet';
import { BUDAPEST_CENTER } from '../map';

// Seeded PRNG (mulberry32), so the generated points are identical on every load.
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Synthetic test points, normally distributed around the city centre (Box–Muller transform).
export function generatePoints(count: number, seed = 42): L.LatLng[] {
  const random = seededRandom(seed);
  const [lat, lng] = BUDAPEST_CENTER;
  const spread = 0.04; // standard deviation in degrees (~4 km north–south)

  return Array.from({ length: count }, () => {
    const r = Math.sqrt(-2 * Math.log(1 - random()));
    const angle = 2 * Math.PI * random();
    // A degree of longitude is ~0.68 of a degree of latitude here, so scale it to keep the spread round.
    return L.latLng(lat + r * Math.cos(angle) * spread, lng + (r * Math.sin(angle) * spread) / 0.68);
  });
}
