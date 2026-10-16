import 'leaflet/dist/leaflet.css';
import './style.css';
import './leaflet-icon-fix';
import { createMap } from './map';
import { fetchGeoJSON, type DistrictCollection, type PoiCollection } from './data/load';
import { generatePoints } from './data/generate';
import { createPoiGeoJsonLayer, createShapesLayer } from './layers/pois';
import { createDistrictLayer, districtLabel } from './layers/districts';
import { createAreaLegend } from './layers/legend';
import { createClusterLayer, createCanvasLayer, createDomMarkerLayer } from './layers/stress';
import { MeasureTool } from './tools/measure';
import { setupLocate } from './tools/locate';
import { showInfo } from './ui/sidebar';
import { escapeHtml } from './utils/html';

const { map, layerControl } = createMap('map');

const measureTool = new MeasureTool(map, showInfo);
setupLocate(map, showInfo);

async function init(): Promise<void> {
  const [poiData, districtData] = await Promise.all([
    fetchGeoJSON<PoiCollection>('data/pois.geojson'),
    fetchGeoJSON<DistrictCollection>('data/districts.geojson'),
  ]);

  // Added first so districts render underneath the shapes and markers.
  const districtLayer = createDistrictLayer(districtData, (district, bounds) => {
    // Polygon clicks also reach the map, so ignore selection while a measurement is in progress.
    if (measureTool.active) return;
    map.fitBounds(bounds, { padding: [20, 20] });
    showInfo(`
      <h2>${escapeHtml(districtLabel(district))}</h2>
      Area: ${district.area_km2.toFixed(1)} km²
    `);
  }).addTo(map);
  const shapesLayer = createShapesLayer().addTo(map);
  const poiLayer = createPoiGeoJsonLayer(poiData).addTo(map);

  layerControl.addOverlay(districtLayer, 'Districts');
  layerControl.addOverlay(shapesLayer, 'Shapes');
  layerControl.addOverlay(poiLayer, 'Sights');

  // Performance comparison: the same points rendered three ways, off by default.
  const testPoints = generatePoints(5000);
  layerControl.addOverlay(createDomMarkerLayer(testPoints), '5,000 markers (DOM)');
  layerControl.addOverlay(createCanvasLayer(testPoints), '5,000 circles (Canvas)');
  layerControl.addOverlay(createClusterLayer(testPoints), '5,000 markers (clustered)');

  createAreaLegend().addTo(map);

  map.fitBounds(poiLayer.getBounds(), { padding: [50, 50] });
}

init().catch(err => {
  console.error(err);
  document.getElementById('info')!.textContent = `Could not load map data: ${err.message}`;
});
