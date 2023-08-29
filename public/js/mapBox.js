/*eslint-disable*/
console.log('Hello from Client Side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
    'pk.eyJ1IjoiYXJwaXRqYW5hMjEwMyIsImEiOiJjbGx2c3oydGgxd2k3M2t0aDVmZzdsNGxmIn0.t2GXGPH5VlxDKRuqgIq-ZQ';
var map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/streets-v11',
    style: 'mapbox://styles/arpitjana2103/cllvtjnmo00dt01pecx465tx6',
    // style: 'mapbox://styles/arpitjana2103/cllvtoc9d00ep01qy5tv7fn2n',
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false,
    scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(function (loc) {
    console.log(loc);
    // Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
    })
        .setLngLat(loc.coordinates)
        .addTo(map);

    // Add popup
    new mapboxgl.Popup({
        offset: 30,
        closeButton: false,
        maxWidth: '500px',
        className: 'mapPopUp',
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day} : ${loc.description}<p/>`)
        .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
});
