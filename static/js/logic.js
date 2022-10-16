function addCircle(map, lat, lng, size, mag, place, time) {
  var circle = L.circle([lat, lng], {
    color: getColor(mag),
    fillColor: getColor(mag),
    fillOpacity: 0.8,
    radius: size * 1500
  }).addTo(map).bindPopup(popupText(mag, place, time));
}

function popupText(mag, place, time) {
  return 'Magnitude: ' + mag + '<br>Place: ' + place +
    '<br>Time: ' + Date(time);
}

function getColor(d) {
  return d > 6 ? '#d73027' :
    d > 5 ? '#f46d43' :
    d > 4 ? '#fdae61' :
    d > 3 ? '#fee08b' :
    d > 2 ? '#d9ef8b' :
    d > 1 ? '#a6d96a' :
    d > 0 ? '#66bd63' :
    '#1a9850';
}

async function getData() {
  const requestURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
  const request = new Request(requestURL);

  const response = await fetch(request);
  const earthquakes = await response.json();

  return earthquakes.features;
}

function getEarthquakeProperties(value) {
  return {
    "lat": value['geometry']['coordinates'][1],
    "lng": value['geometry']['coordinates'][0],
    "size": value['geometry']['coordinates'][2],
    "mag": value['properties']['mag'],
    "place": value['properties']['place'],
    "time": value['properties']['time']
  };
}

var createMap = function() {
  var map = L.map('map').setView([39.83, -98.59], 4);

  var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // iterate through the earthquakes array and add a circle for each
  const earthquakes = getData();
  earthquakes.then(value => {
    value.forEach(item => {
      const earthquake = getEarthquakeProperties(item);
      addCircle(map,
                lat = item['geometry']['coordinates'][1],
                lng = item['geometry']['coordinates'][0],
                size = item['geometry']['coordinates'][2],
                mag = item['properties']['mag'],
                place = item['properties']['place'],
                time = item['properties']['time']
      );
    });

  });
};

createMap();
