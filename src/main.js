var data;
var projection;
var routes = [];
var w = 1000, h = 800;
var frameNum = 0;

var ctx = d3.select('#map').node().getContext('2d');
var lineGenerator = d3.line()
  .x(function(d) {
    return d.x;
  })
  .y(function(d) {
    return d.y;
  })
  .context(ctx);

function initializeData(dt) {
  data = dt.map(function(d) {
    return {
      id: +d.Trip,
      lat: +d.LatitudeWsu,
      lon: +d.LongitudeWsu
    }
  });
}

function initProjection() {
  var geoJSON = {
    type: "FeatureCollection",
    features: []
  }

  data.forEach(function(d) {
    geoJSON.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [d.lon, d.lat]
      }
    });
  });

  projection = d3.geoMercator();
  projection.fitSize([w, h], geoJSON);
}

function projectPoints() {
  data.forEach(function(d) {
    var pt = projection([d.lon, d.lat]);
    d.x = pt[0];
    d.y = pt[1];
  });
}

function getRoutes() {
  data.forEach(function(d) {
    if(!routes[d.id]) {
      routes[d.id] = []
    }
    routes[d.id].push({
      x: d.x,
      y: d.y
    });
  });
}

function updateChart() {
  ctx.clearRect(0, 0, w, h);

  // Draw a multi-segment line for each route
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
  routes.forEach(function(d) {
    ctx.beginPath();
    lineGenerator(d);
    ctx.stroke();
  });

  // Draw a point for each route for the current frameNum
  ctx.fillStyle = 'rgba(2, 77, 148, 0.301)';
  routes.forEach(function(d) {
    if(frameNum >= d.length) return;
    ctx.fillRect(d[frameNum].x, d[frameNum].y, 5, 5);
  });

  }

  function updateChart2() {
    var map = L.map('chart');
  
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
       attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }).addTo(map);
  
    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());
  }

function initAnimation() {
  let maxRouteLength = d3.max(routes, function(d) {
    return d ? d.length : 0;
  });

  window.setInterval(function() {
    frameNum++;

    // reset the frame counter
    if(frameNum === maxRouteLength) {
      frameNum = 0;
    }
    updateChart();
  }, 100);
}


d3.csv('../data/ConnectedVehicle_D3.csv', function(err, data) {
  initializeData(data);
  initProjection();
  projectPoints();
  getRoutes();
  initAnimation();
});
