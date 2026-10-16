import L from 'leaflet';
import { AREA_BREAKS, AREA_COLORS } from './districts';

export function createAreaLegend(): L.Control {
  const legend = new L.Control({ position: 'bottomright' });
  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'legend');
    const rows = AREA_COLORS.map((color, i) => {
      const from = i === 0 ? 0 : AREA_BREAKS[i - 1];
      const to = AREA_BREAKS[i];
      const label = to === undefined ? `${from}+` : `${from}–${to}`;
      return `<div><i style="background:${color}"></i>${label}</div>`;
    });
    div.innerHTML = `<strong>District area (km²)</strong>${rows.join('')}`;
    return div;
  };
  return legend;
}
