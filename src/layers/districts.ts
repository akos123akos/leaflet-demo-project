import L from 'leaflet';
import type { DistrictCollection, DistrictProperties } from '../data/load';
import { escapeHtml } from '../utils/html';

// Class breaks in km²; AREA_COLORS has one extra entry for values above the last break.
export const AREA_BREAKS = [5, 15, 25, 35, 45];
export const AREA_COLORS = ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'];

const HIGHLIGHT_STYLE: L.PathOptions = { color: '#f59e0b', weight: 3, fillOpacity: 0.8 };

export function getAreaColor(areaKm2: number): string {
  const index = AREA_BREAKS.findIndex(limit => areaKm2 < limit);
  return AREA_COLORS[index === -1 ? AREA_COLORS.length - 1 : index];
}

export function districtLabel({ name, nickname }: DistrictProperties): string {
  return nickname ? `${name} – ${nickname}` : name;
}

export function createDistrictLayer(
  data: DistrictCollection,
  onSelect: (district: DistrictProperties, bounds: L.LatLngBounds) => void,
): L.GeoJSON {
  const districtLayer = L.geoJSON(data, {
    attribution: 'Districts &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors (ODbL)',

    style: feature => ({
      fillColor: getAreaColor(feature?.properties.area_km2 ?? 0),
      fillOpacity: 0.6,
      color: 'white',
      weight: 1.5,
    }),

    onEachFeature: (feature, layer) => {
      layer.bindTooltip(escapeHtml(districtLabel(feature.properties)), { sticky: true });

      const polygon = layer as L.Polygon;
      polygon.on({
        mouseover: () => {
          polygon.setStyle(HIGHLIGHT_STYLE);
          // Keeps the highlighted outline above neighbouring polygons.
          polygon.bringToFront();
        },
        mouseout: () => districtLayer.resetStyle(polygon),
        click: () => onSelect(feature.properties, polygon.getBounds()),
      });
    },
  });

  return districtLayer;
}
