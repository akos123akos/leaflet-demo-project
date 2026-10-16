# Budapest Explorer

An interactive map of Budapest built with **Leaflet** and **TypeScript**: sights, district boundaries shaded by area, a distance-measuring tool, geolocation, and a rendering-performance comparison with 5,000 points.

**Live demo:** https://akos123akos.github.io/leaflet-demo-project/

## Features

- **Base maps:** OpenStreetMap streets and Esri satellite imagery, with a layer switcher.
- **Sights:** 15 points of interest loaded from GeoJSON, with colour-coded category icons, tooltips and popups.
- **District choropleth:** all 23 Budapest districts from OpenStreetMap, shaded by area, with a legend. Hovering highlights a district; clicking zooms to it and shows its details in the sidebar.
- **Distance measuring:** click to build a route. The sidebar shows the great-circle distance alongside a naive "flat" calculation and the error between them.
- **Locate me:** shows the user's position with an accuracy circle.
- **Performance comparison:** the same 5,000 points rendered three ways: as DOM markers, on a single Canvas, and clustered.

## Technical highlights

- **Typed GeoJSON:** features use `FeatureCollection<Geometry, Props>` from `@types/geojson`, so feature properties are type-checked. Data is loaded at runtime from `public/data`.
- **Coordinate handling:** Leaflet uses `[lat, lng]` and GeoJSON uses `[lng, lat]`. All GeoJSON goes through `L.geoJSON`, which converts the order, instead of being parsed by hand.
- **Geodesic vs planar distance:** the measuring tool uses haversine distances. A planar calculation on raw degrees overestimates east–west distances by about 48% at Budapest's latitude, because a degree of longitude shrinks with `cos(latitude)`.
- **Event handling:** hover and click handlers on each district, with click propagation managed between layers, controls and the map. A stable handler reference is used for `on`/`off`.
- **Rendering at scale:**
  - Thousands of DOM markers slow the browser down.
  - A shared Canvas renderer draws all the points on a single element.
  - Clustering (`leaflet.markercluster`) renders only what's visible and keeps the map readable.
- **Safe popups:** all data-driven text is HTML-escaped before it's inserted into popups, tooltips or the sidebar.
- **Bundler setup:** includes the fix for Leaflet's default marker images under Vite, and relative asset paths so the build works from any subfolder.

## Tech stack

TypeScript · Vite · Leaflet 1.9 · Leaflet.markercluster · GitHub Actions / GitHub Pages

## Getting started

```bash
npm install
npm run dev       # development server
npm run build     # type-check and production build into dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  main.ts                 App entry point: loads data and wires up layers and tools
  map.ts                  Map setup, base layers and layer control
  leaflet-icon-fix.ts     Default marker images under a bundler
  data/                   GeoJSON types and loading, POI categories, test-point generator
  layers/                 Sights, districts, legend, performance-comparison layers
  tools/                  Measuring tool, geolocation, reusable button control
  ui/, utils/             Sidebar output, HTML escaping
public/data/              pois.geojson, districts.geojson
```

## Deployment

Every push to `main` builds the app and publishes it to GitHub Pages via `.github/workflows/deploy.yml`. In the repository settings, set **Pages → Source** to **GitHub Actions**.

## Data and attribution

- **District boundaries:** © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, available under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/). Extracted via the Overpass API (administrative level 9 boundaries within Budapest), simplified, and given an `area_km2` property computed from the original geometry.
- **Map tiles:** © OpenStreetMap contributors; satellite imagery © Esri. Attribution is shown on the map.
- **Points of interest:** hand-picked; coordinates are approximate.
- **Performance test points:** synthetic, generated in the browser.
