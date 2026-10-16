import L from 'leaflet';

// Leaflet coordinates are [lat, lng]; GeoJSON uses [lng, lat].
export const BUDAPEST_CENTER: L.LatLngTuple = [47.4979, 19.0402];

export interface MapContext {
  map: L.Map;
  layerControl: L.Control.Layers;
}

export function createMap(containerId: string): MapContext {
  const map = L.map(containerId, {
    center: BUDAPEST_CENTER,
    zoom: 13,
  });

  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Esri's tile scheme is {z}/{y}/{x}.
  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri',
  });

  const layerControl = L.control.layers({ 'Streets': osm, 'Satellite': satellite }).addTo(map);

  return { map, layerControl };
}
