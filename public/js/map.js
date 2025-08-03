if (typeof maplibregl !== "undefined" && typeof coordinates !== "undefined") {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: coordinates,
    zoom: 10
  });

  // Create a popup
  const popup = new maplibregl.Popup({ offset: 25 })
    .setHTML(`<h4>Exact Location provided after booking</h4>`);

  // Custom marker using emoji
  const el = document.createElement('div');
  el.innerHTML = '📍';
  el.style.fontSize = '32px';
  el.style.cursor = 'pointer';

  new maplibregl.Marker({ element: el })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);
} else {
  console.error("MapLibre or coordinates not available.");
}


