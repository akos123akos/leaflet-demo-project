import L from 'leaflet';
import { createButtonControl } from './button-control';

export function setupLocate(map: L.Map, onMessage: (html: string) => void): void {
  const layer = L.layerGroup().addTo(map);

  createButtonControl('📍', 'Show my location', () => {
    onMessage('Finding your location…');
    map.locate({ setView: true, maxZoom: 16 });
  }).addTo(map);

  map.on('locationfound', (e: L.LocationEvent) => {
    layer.clearLayers();
    // Accuracy circle: the position is only known to within e.accuracy metres.
    L.circle(e.latlng, { radius: e.accuracy, color: '#2563eb', fillOpacity: 0.15, weight: 1 }).addTo(layer);
    L.circleMarker(e.latlng, { radius: 6, color: 'white', fillColor: '#2563eb', fillOpacity: 1, weight: 2 }).addTo(layer);
    onMessage(`<b>You are here</b><br>Accuracy: ±${Math.round(e.accuracy)} m`);
  });

  map.on('locationerror', (e: L.ErrorEvent) => onMessage(`Could not find your location: ${e.message}`));
}
