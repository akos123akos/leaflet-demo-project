import type { FeatureCollection, Geometry, Point, Polygon, MultiPolygon } from 'geojson';
import type { PoiCategory } from './pois';

export interface PoiProperties {
  id: string;
  name: string;
  category: PoiCategory;
  description: string;
}

export interface DistrictProperties {
  district: number;   // 1–23
  name: string;       // e.g. "V. kerület"
  nickname: string;   // e.g. "Belváros-Lipótváros"; empty for districts II and XVI
  area_km2: number;
}

export type PoiCollection = FeatureCollection<Point, PoiProperties>;
export type DistrictCollection = FeatureCollection<Polygon | MultiPolygon, DistrictProperties>;

// Loads a GeoJSON file from /public. The path is resolved against Vite's base URL, so it also works
// when the app is served from a subfolder (e.g. GitHub Pages). The data is trusted, not validated.
export async function fetchGeoJSON<T extends FeatureCollection<Geometry>>(path: string): Promise<T> {
  const url = `${import.meta.env.BASE_URL}${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}
