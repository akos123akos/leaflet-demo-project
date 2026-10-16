import L from 'leaflet';
import { CATEGORY_STYLE, type PoiCategory } from '../data/pois';
import type { PoiCollection } from '../data/load';
import { escapeHtml } from '../utils/html';

export function createPoiIcon(category: PoiCategory): L.DivIcon {
  const { emoji, color } = CATEGORY_STYLE[category];
  return L.divIcon({
    className: 'poi-icon',
    html: `<div style="background:${color}">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16], // centre of the badge sits on the coordinate
  });
}

export function createPoiGeoJsonLayer(data: PoiCollection): L.GeoJSON {
  return L.geoJSON(data, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: createPoiIcon(feature.properties.category) }),

    onEachFeature: (feature, layer) => {
      const { name, description } = feature.properties;
      layer
        .bindPopup(`<b>${escapeHtml(name)}</b><br>${escapeHtml(description)}`)
        .bindTooltip(escapeHtml(name));
    },
  });
}

// A walking route, a 500 m radius around St. Stephen's Basilica and an outline of Margaret Island.
export function createShapesLayer(): L.FeatureGroup {
  const group = L.featureGroup();

  L.polyline(
    [
      [47.5071, 19.0456], // Parliament
      [47.4989, 19.0436], // Chain Bridge
      [47.4962, 19.0396], // Buda Castle
      [47.5021, 19.0344], // Fisherman's Bastion
    ],
    { color: 'blue', weight: 4 }
  ).addTo(group);

  L.circle([47.5009, 19.0539], { radius: 500, color: 'red', weight: 4 }).addTo(group);

  L.polygon(
    [
      [47.540, 19.045],
      [47.540, 19.057],
      [47.512, 19.051],
      [47.512, 19.039],
    ],
    { color: 'green', weight: 4, fillOpacity: 0.3 }
  ).addTo(group);

  return group;
}
