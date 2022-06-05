
//1. find the URL to  GeoJSON data file earthQuake, major earthquake and tectonic plate.
//2. Open the index.html file, and in the <head> section 
//   above the CSS link, add the following D3.js library 
//   file script 
//   <script src="https://d3js.org/d3.v5.min.js"></script> 
//3. in CLI, cd directory that holds the index.html and run 
//   "python -m http.server" command to start webserver
//4. Need a static/js/config.js file that is holding an API key to api.mapbox.com

// check to see if the code is working
console.log("working");


// create the street view tile layer that will be an option for our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: API_KEY
});

// create the street view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/satellite-streets-v11',
  accessToken: API_KEY
});

// create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/dark-v10',
  accessToken: API_KEY
});


// 1. Create a base layer that holds both maps
let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets,
    "Dark": dark
   };

// 2. Create an overlay layer for our earthquake data.
let allEarthquakes = new L.layerGroup();
// 3. Create an overlay layer for our tectonic plates data.
let tectonicPlates = new L.layerGroup();
// 4. Create an overlay layer for our major earthquake data.
let majorEQ = new L.LayerGroup();

// Define the overlay object，which contains 3 overlays.
// These overlays will be visible all the time.
let overlays = {
    'Tectonic Plates': tectonicPlates,
    'Earthquakes': allEarthquakes,
    'Major Earthquakes': majorEQ
  };



// Create the map object with a center and zoom level.
let map = L.map("mapid", {
    center: [40.7, -94.5],
    zoom: 3,
    // add layers attrebute,show map of default(streets) 
    // style first
    layers: [streets]
  });

// Pass map layers into our layers control and 
// add the layers control to the map.
// use the Leaflet control.layers, which controls the layers
// add the variable baseMaps to the Layers Control object
// add the variable overlays to the Layers Control object
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the earthquake GeoJSON URL.
let earthQuake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Retrieve the earthquake GeoJSON data.
d3.json(earthQuake).then(function(data) {

    // Creating a GeoJSON layer with the retrieved data.
    L.geoJSON(data, {
        // // set the style for each circleMarker using 
        // // styleInfo function.
        style: styleInfo,

        // change the basic marker to a circleMarker by 
        // using the pointToLayer function.
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
                    console.log(data);
                    return L.circleMarker(latlng);
                },
        // In the geoJson layer, add the onEachFeature 
        // function with the bindPopup() method to add 
        // a popup for each circle marker. 
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + 
            "<br>Location: " + feature.properties.place);
          }
          
    }).addTo(allEarthquakes);

    // Add the earthquakes layer to the map
    allEarthquakes.addTo(map);

    //create a function styleInfo(), which will contain 
    //all the style parameters for each earthquake plotted.
    // passed the argument feature to reference 
    // each object's features.
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,

            //Use getColor() function to change the marker's 
            //color based on the magnitude.
            fillColor: getColor(feature.properties.mag),
            color: "#000000",         // black
            // use a getRadius() function to calculate 
            // the radius for each earthquake.
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
            };
    }

    // write code for the getColor() function to change 
    // the marker's color based on the magnitude. 
    // if the magnitude is greater than 5, it will be a certain color, 
    // if the magnitude is greater than 4, it will be a different color, 
    // and so on.
    // This function determines the color of the circle based on the magnitude of the earthquake.
    function getColor(magnitude) {
        if (magnitude > 5) {
        return "#ea2c2c";
        }
        if (magnitude > 4) {
        return "#ea822c";
        }
        if (magnitude > 3) {
        return "#ee9c00";
        }
        if (magnitude > 2) {
        return "#eecc00";
        }
        if (magnitude > 1) {
        return "#d4ee00";
        }
        return "#98ee00";
    }
    // This function determines the radius of the earthquake 
    // marker based on its magnitude.
    // Earthquakes with a magnitude of 0 will be plotted 
    // with a radius of 1.
    function getRadius(magnitude) {
        if (magnitude === 0) {
        return 1;
        }
        return magnitude * 4;
    }


});

// Accessing the tectonic plate data GeoJSON URL.
let tectonicPlateData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

//Retrieve the tectonic plate GeoJSON data.
d3.json(tectonicPlateData).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    color: "red",
    weight: 3
  }).addTo(tectonicPlates);
  
  // Then add the tectonicPlates layer to the map.
  tectonicPlates.addTo(map);
});

// Accessing the GeoJSON URL for major earthquake data >4.5 mag for the week.
let majorEarthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

// Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
d3.json(majorEarthquakeData).then(function(data) {

  // Use the same style as the earthquake data.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }   

  
  // use three colors for the major earthquakes based on the magnitude of the earthquake.
  function getColor(magnitude) {
    if (magnitude > 6) {
      return "#A5030B";
    }
    if (magnitude >= 5) {
      return "#F0AA73";
    }
      return "#f2df9d";
  }
   
  // Use the function that determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  
  // Creating a GeoJSON layer with the retrieved data that adds a circle to the map 
  // sets the style of the circle, and displays the magnitude and location of the earthquake
  //  after the marker has been created and styled.
  L.geoJson(data, {
        style: styleInfo,

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(majorEQ);
    
  // Add the major earthquakes layer to the map.
  majorEQ.addTo(map);

});

// Create a legend Leaflet control() object.
let legend = L.control({
    position: "bottomright"
  });

// Add a legend to the map with legend.onAdd
// The legend will be added to a div element on the 
// index.html file using the DomUtil utility function.
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    // add a array to variable magnitudes
    const magnitudes = [0, 1, 2, 3, 4, 5];
    // add a colors array that holds the colors for magnitudes
    const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
    ];
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
};

legend.addTo(map);



