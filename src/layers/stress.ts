import L from 'leaflet';
// The plugin extends the global `L` created by Leaflet, so it must be imported after Leaflet.
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Baseline: one DOM element (plus shadow) per marker.
export function createDomMarkerLayer(points: L.LatLng[]): L.LayerGroup {
  return L.layerGroup(points.map(latlng => L.marker(latlng)));
}

// All circles share a single renderer, so they're painted onto one <canvas> instead of 5,000 SVG elements.
export function createCanvasLayer(points: L.LatLng[]): L.LayerGroup {
  const renderer = L.canvas();
  return L.layerGroup(
    points.map(latlng => L.circleMarker(latlng, { renderer, radius: 3, weight: 1, color: '#e11d48' })),
  );
}

// Only the clusters and markers visible at the current zoom are rendered.
export function createClusterLayer(points: L.LatLng[]): L.LayerGroup {
  // chunkedLoading adds markers in batches so the page stays responsive.
  const cluster = L.markerClusterGroup({ chunkedLoading: true });
  cluster.addLayers(points.map(latlng => L.marker(latlng)));
  return cluster;
}
