import L from 'leaflet';

// A single-button control styled like Leaflet's zoom buttons.
export function createButtonControl(
  label: string,
  title: string,
  onClick: (button: HTMLAnchorElement) => void,
  position: L.ControlPosition = 'topleft',
): L.Control {
  const control = new L.Control({ position });
  control.onAdd = () => {
    const container = L.DomUtil.create('div', 'leaflet-bar');
    const button = L.DomUtil.create('a', 'button-control', container);
    button.href = '#';
    button.title = title;
    button.setAttribute('role', 'button');
    button.textContent = label;

    // Stops button clicks from also registering as map clicks (or double-click zooms).
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.on(button, 'click', e => {
      L.DomEvent.preventDefault(e);
      onClick(button);
    });
    return container;
  };
  return control;
}
