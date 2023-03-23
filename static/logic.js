
//SETTING UP GLOBAL VARIABLES 

    //VARIABLE USED FOR D3 JSON REQUEST FUNCTION
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

    // D3 REQUEST TO GET DATA
    d3.json(url).then(function (data) {
        console.log(data)
        createFeatures(data.features);
        });

    // SET THE PAREMETERS THAT WILL DETERMINE THE COLOR OF EACH CIRCLE MARKER 
    function getColor(depth) {
        return  depth >= 90 ? 'rgb(255,13,13)':
        depth >= 70 && depth < 90  ? 'rgb(255,78,17)':
        depth >= 50 && depth < 70  ? 'rgb(255,142,21)':
        depth >= 30 && depth < 50  ? 'rgb(250,183,51)':
        depth >= 10 && depth < 30  ? 'rgb(172,179,52':
        'rgb(105,179,76)'
    };



// FUNCTION TO RENDER MAP TILES STYLES AND CONTROLS TO TOGGLE BETWEEN EACH VIEW--//
function createMap(earthquakes){

    // STREET VIEW MAP    .
        let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })

    // OVERLAY VIEW LIST FOR THE CONTROL FUCNTION
        let baseMaps = {
            "Street View": street,
            // "Topographic View": topo
        };

    // CREATE THE LEAFLET MAP PASSING THE DATA TO BE DISPLAYED WHEN FIRST LOADED.        
        var myMap = L.map("map", {
            center: [40, -107],
            zoom: 4,
            layers: [street, earthquakes]
        });

    // OVERLAY OBJECTS TO STORE AND DISPLAY DATA ON THE MAP
        let overlayMaps = {
            Earthquakes: earthquakes
        };

    // CONTROL THAT TOGGLES THE MAP VIEWS AND EARTHQUAKE OBJECTS        
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
            })
            .addTo(myMap);

    //LEGEND ON THE BOTTOM RIGHT EXPLAINING DEPTH COLOR CODES
        let legend = L.control({position: "bottomright"});
            legend.onAdd = function() {
            let div = L.DomUtil.create("div", "info legend"),
            depth = [-10, 10, 30, 50, 70, 90];
            div.innerHTML += "<h2 style='text-align: center'>Depth</h2>"
        for (var i =0; i < depth.length; i++) {
            div.innerHTML += 
            '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
            }
        return div;
        };
        legend.addTo(myMap);

};          

// FUNCTION THAT WILL POPULATE EARTHQUAKE DATA ONTO THE MAP
function createFeatures(earthquakeData) {

    // FUNCTION THAT ADDS POPUP TO DISPLAY DATA FOR EACH EARTHQUAKE
        function onEachFeature(feature, layer) {
            layer.bindPopup(
            `<h2>Magnitude ${feature.properties.mag} Earthquake</h2>
            <h3>Depth: ${feature.geometry.coordinates[2]}</h3>
            <hr>
            <h3>${feature.properties.place}</h3>
            <hr>
            <p>${new Date(feature.properties.time)}</p>`);
        }

    //CREATE CIRCLE MARKERS THAT WILL HAVE A RADIUS BASED ON THE MAG (circles magnified by 3 for better visuals) AND COLOR BASED ON THE DEPTH
        let earthquakes = L.geoJSON(earthquakeData, {
            pointToLayer: function(feature, latlng) {
                return new L.CircleMarker(latlng, {
                    radius: feature.properties.mag * 3,
                    color: getColor(feature.geometry.coordinates[2]),
                    })
                        },
            onEachFeature: onEachFeature
            });

    // CALLING THE FUNCTION TO DISPLAY THE MAPS
        createMap(earthquakes);
};

