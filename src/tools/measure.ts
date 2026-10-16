import L from 'leaflet';
import { createButtonControl } from './button-control';

// Approximate length of one degree of latitude.
const METRES_PER_DEGREE = 111_320;

// Great-circle length of the route in metres (LatLng.distanceTo uses the haversine formula).
export function totalDistance(points: L.LatLng[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += points[i - 1].distanceTo(points[i]);
  }
  return total;
}

// Planar approximation, shown for comparison. It treats degrees as flat x/y and ignores that a degree
// of longitude shrinks with cos(latitude), overestimating east–west distances by ~48% at Budapest's latitude.
export function naiveDistance(points: L.LatLng[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dLat = points[i].lat - points[i - 1].lat;
    const dLng = points[i].lng - points[i - 1].lng;
    total += Math.sqrt(dLat ** 2 + dLng ** 2) * METRES_PER_DEGREE;
  }
  return total;
}

export function formatDistance(metres: number): string {
  return metres < 1000 ? `${metres.toFixed(0)} m` : `${(metres / 1000).toFixed(2)} km`;
}

// Click to add points; press Esc or the button again to finish.
export class MeasureTool {
  active = false;
  private points: L.LatLng[] = [];
  private readonly layer = L.layerGroup();
  private readonly line = L.polyline([], { color: '#e11d48', weight: 3, dashArray: '6 6' });
  private readonly control: L.Control;

  constructor(
    private readonly map: L.Map,
    private readonly onUpdate: (html: string) => void,
  ) {
    this.line.addTo(this.layer);
    this.control = createButtonControl('📏', 'Measure distance (Esc to finish)', () => this.toggle()).addTo(map);
  }

  toggle(): void {
    this.active ? this.stop() : this.start();
  }

  private start(): void {
    this.active = true;
    this.points = [];
    this.line.setLatLngs([]);
    this.layer.clearLayers().addLayer(this.line).addTo(this.map);

    this.map.doubleClickZoom.disable();
    this.map.getContainer().classList.add('measuring');
    this.setButtonActive(true);
    this.map.on('click', this.handleClick);
    // Capture phase, so the key is seen even if another handler stops propagation.
    document.addEventListener('keydown', this.handleKey, true);
    this.report();
  }

  private stop(): void {
    this.active = false;
    this.map.doubleClickZoom.enable();
    this.map.getContainer().classList.remove('measuring');
    this.setButtonActive(false);
    this.map.off('click', this.handleClick);
    document.removeEventListener('keydown', this.handleKey, true);
    // The route stays visible until the next measurement starts.
    this.report();
  }

  private setButtonActive(active: boolean): void {
    this.control.getContainer()?.querySelector('a')?.classList.toggle('active', active);
  }

  // Arrow-function properties keep a stable reference for map.on() / map.off().
  private handleClick = (e: L.LeafletMouseEvent): void => {
    this.points.push(e.latlng);
    this.line.setLatLngs(this.points);
    L.circleMarker(e.latlng, { radius: 4, color: '#e11d48', fillOpacity: 1 }).addTo(this.layer);
    this.report();
  };

  private handleKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.stop();
  };

  private report(): void {
    const title = this.active ? 'Measuring' : 'Measurement finished';
    const hint = this.active
      ? 'Press Esc or click 📏 again to finish.'
      : 'Click 📏 to start a new measurement.';

    if (this.points.length < 2) {
      const prompt = this.active ? 'Click on the map to add points.<br>' : '';
      this.onUpdate(`<b>${title}</b><br>${prompt}<small>${hint}</small>`);
      return;
    }

    const real = totalDistance(this.points);
    const naive = naiveDistance(this.points);
    const error = ((naive - real) / real) * 100;
    this.onUpdate(`
      <b>${title}</b> (${this.points.length} points)<br>
      Great-circle distance: <b>${formatDistance(real)}</b><br>
      Naive flat distance: ${formatDistance(naive)} (${error >= 0 ? '+' : ''}${error.toFixed(1)}%)<br>
      <small>${hint}</small>
    `);
  }
}
