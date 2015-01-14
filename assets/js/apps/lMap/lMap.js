define([
    'backbone',
    'common/dispatch',
    'geoJson/trachyte',
    'leaflet',
    'leaflet.draw',
    'jquery'
    
], function (
    Backbone,
    dispatch,
    trachyte

){
    var LMap = {};
    var user;
    var map;
    var baseUrl;
    
    
    LMap.burnMap = function (mapModel, userModel) {
        console.log("burning", mapModel, userModel);
        //wack the old map
        map.remove();
        map = L.map('leafletMap');
        map.setView( [ mapModel.get("centroid").coordinates[1], mapModel.get("centroid").coordinates[0] ], mapModel.get("zoom") );
        var jjj = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}.jpg',{        
        //var jjj = L.tileLayer('http://localhost/tServer/api/eImg/{z}/{y}/{x}.jpg',{
            attribution: 'lkjlkj',
            minZoom: 2,
            maxZoom: 15
        }).addTo(map);
        var i = 0;
        var baseLayer = L.geoJson(mapModel.get("mapJson"), {
            //interesting . . . leaflet appears to call onEachFeature every time a feature . . 
            //ie- index saves off (probably not what we want??)
            onEachFeature: function (feature, layer) {
                //console.log(feature, layer);
                feature.properties.index = i;
                i += 1;
                
                layer.on("click", function (e, g) {
                    console.log("click", e.target);
                });
                
                layer.on("contextmenu", function (e) {
                    console.log("right click",e);
                });
                //bind the popup for description (properties.desc)
                layer.bindPopup(feature.properties.desc);
                
            }
        }).addTo(map);    
    
    }

    LMap.initialize = function (iUser) {
        //set user 
        user = iUser;
        baseUrl = dispatch.request("MapApp:getBaseUrl");
    
        map = L.map('leafletMap').setView([37.896, -110.509], 13);
        var jjj = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}.jpg',{        
        //var jjj = L.tileLayer('http://localhost/tServer/api/eImg/{z}/{y}/{x}.jpg',{
            attribution: 'lkjlkj',
            minZoom: 2,
            maxZoom: 15
        }).addTo(map);
        
        //tell leaflet where the images are
        L.Icon.Default.imagePath =  baseUrl + 'assets/css/leaflet/images/';
        
        var i = 0;
        var myLayer = L.geoJson(trachyte, {
            //interesting . . . leaflet appears to call onEachFeature every time a feature . . 
            //ie- index saves off (probably not what we want??)
            onEachFeature: function (feature, layer) {
                //console.log(feature, layer);
                feature.properties.index = i;
                i += 1;
                
                layer.on("click", function (e, g) {
                    console.log("click", e.target);
                });
                
                layer.on("contextmenu", function (e) {
                    console.log("right click",e);
                });
                //bind the popup for description (properties.desc)
                layer.bindPopup(feature.properties.desc);
                
            }
        }).addTo(map);
        
        // Initialise the FeatureGroup to store editable layers
        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        // Initialise the draw control and pass it the FeatureGroup of editable layers
        
        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: myLayer
            },
            position: 'topright',
            draw: {
                rectangle: false,
                circle: false
            }
        });
        map.addControl(drawControl);        
        map.on("draw:created", function (e) {
            console.log("draw:created");
            var featureJson = e.layer.toGeoJSON();
            myLayer.addData(e.layer.toGeoJSON());
            saveMapJson(myLayer.toGeoJSON());
        });
        map.on("draw:edited", function (e) {
            console.log("draw:edited");
            saveMapJson(myLayer.toGeoJSON());
        });
        map.on("draw:deleted", function (e) {
            console.log("draw:deleted");
            saveMapJson(myLayer.toGeoJSON());       
        });
        
        function saveMapJson(mapJson){
            $.ajax({
                url: baseUrl + "api/maps/",
                type: "post",
                data: {
                    pk: 'mapJson',
                    //do not hand the backbone model off . . things crash, map editor fails, ugly
                    mtoUser: user.toJSON(), 
                    mapJson: mapJson,
                },
                success: function (data) {
                    console.log("xhr data:", data);
                },
                error: function (error) {
                
                }
            });        
        }        
    }
    
    return LMap;

});