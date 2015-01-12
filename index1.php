<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">  
    <link rel="stylesheet" href="assets/css/leaflet/leaflet.css" type="text/css">
    <link rel="stylesheet" href="assets/css/leaflet-draw/leaflet.draw.css" type="text/css">
    <style>
        body{
            margin: 0px;
            padding: 0px;
        }
       .map {
        height: 700px;
        width: 100%;
      }
      .control{
        position: absolute;
        left: 60px;
        top: 20px;
        width: 350px;
        z-index: 100;
        background-color: #ccc;
        max-height: 400px;
        overflow: auto;     
      }
      table tr {
        font-size: 11px;
      }
    </style>
    <script src="assets/js/vendor/jquery.js" type="text/javascript"></script>
    <script src="assets/js/vendor/leaflet.js" type="text/javascript"></script>
    <script src="assets/js/vendor/leaflet.draw-src.js" type="text/javascript"></script>
    
    <script src="assets/js/geoJson/trachyte.json" type="text/javascript"></script>
    <title>Leaflet</title>
  </head>
  <body>
    <div class="control">
        <h4>Leaflet Map</h4>
        <div>
            <button id="edit1">Edit</button>
        </div>
        <table>
            <thead></thead>
            <tbody id="controlBody">
            </tbody>
        </table>
    </div>
    <div id="map" class="map"></div>
    <script type="text/javascript">
        $(document).ready(function(){
            //bit of a hack to keep the map full screen
            $("#map").css("height", document.documentElement.clientHeight);            
            $(window).resize(function(){
                $("#map").css("height", document.documentElement.clientHeight);
            });
            $("#edit1").on("click", function(){
                editLoaded();
                
            });
        });
        
        //tell leaflet where the images are
        L.Icon.Default.imagePath = 'assets/css/leaflet/images/';
        //var map = L.map('map', {drawControl: true}).setView([37.896, -110.509], 13);
        var map = L.map('map').setView([37.896, -110.509], 13);
        //var jjj = L.tileLayer('http://4umaps.eu/{z}/{x}/{y}.png', {
        //var jjj = L.tileLayer('http://localhost/tServer/api/dImg/{z}/{x}/{y}.png',{
        //notice: arcgisonline is z,y,x while the others are z,x,y
        //var jjj = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}.jpg',{
        
        //var jj = L.tileLayer('http://s3-us-west-1.amazonaws.com/caltopo/topo/{z}/{y}/{x}.png',{

        var jjj = L.tileLayer('http://localhost/tServer/api/eImg/{z}/{y}/{x}.jpg',{
            attribution: 'lkjlkj',
            minZoom: 2,
            maxZoom: 15
        }).addTo(map);
        
        var i = 0;
        var myLayer = L.geoJson(trachyte, {
            //interesting . . . leaflet appears to call onEachFeature every time a feature . . 
            //ie- index saves off (probably not what we want??)
            onEachFeature: function (feature, layer) {
                //console.log(feature, layer);
                feature.properties.index = i;
                i += 1;
                layer.on("click", function (e, g) {
                    console.log(e.target);
                });
                layer.on("contextmenu", function (e) {
                    console.log("cm",e);
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
            var featureJson = e.layer.toGeoJSON();
          
            myLayer.addData(e.layer.toGeoJSON());
            saveMapJson(myLayer.toGeoJSON());
        });
        map.on("draw:edited", function (e) {
            saveMapJson(myLayer.toGeoJSON());
        });
        map.on("draw:deleted", function (e) {
            saveMapJson(myLayer.toGeoJSON());       
        });
        
        function saveMapJson(mapJson){
            $.ajax({
                url: "api/maps/",
                type: "post",
                data: {
                    pk: 'mapJson',
                    mtoUser: {}, 
                    mapJson: mapJson,
                },
                success: function (data) {
                    console.log("xhr data:", data);
                },
                error: function (error) {
                
                }
            });        
        }
        
        function editLoaded(){
            console.log("dI:", myLayer);
            var drawControl2 = new L.Control.Draw({
                edit: {
                    featureGroup: myLayer
                }
            });
            map.addControl(drawControl2);       
        }
        
    </script>
  </body>
</html>