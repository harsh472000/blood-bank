mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyc2g0NyIsImEiOiJja215dXk4YWgwN3FsMnRwZnc4N2lyZmJ6In0.AaYVnonk_P8DaP2hMzyahw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 6,
    center: [71.1924, 22.2587]
});

async function getStores() {
    const res = await fetch('/api/v1/stores');
    const data = await res.json();
    console.log(data)
    /*const img='https://upload.wikimedia.org/wikipedia/commons/1/19/Blood_is_Blood_Logo.png'
    map.addImage('cat', img);*/
    const stores = data.data.map(store => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            store.location.coordinates[0],
            store.location.coordinates[1]
          ]
        },
        properties: {
          storeId: store.storeId,
          icon: 'shop'
        }
      };
    });
  
    loadMap(stores);
}

function loadMap(stores) {
    map.on('load', function() {
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: stores
          }
        },
        layout: {
          'icon-image': '{icon}-15',
          'icon-size': 1.5,
          'text-field': '{storeId}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.9],
          'text-anchor': 'top'
        }
      });
    });
}

getStores()