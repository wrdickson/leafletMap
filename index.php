<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="assets/css/leaflet/leaflet.css" type="text/css">
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
    <script src="assets/js/geoJson/trachyte.json" type="text/javascript"></script>
    <title>Leaflet</title>
  </head>
  <body>
    <div class="control">
        <h4>Leaflet Map</h4>
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
            $(window).resize(function(){
                $("#map").css("height", document.documentElement.clientHeight);
            });
        });
        
        //tell leaflet where the images are
        L.Icon.Default.imagePath = 'assets/css/leaflet/images/';
        var map = L.map('map', {drawControl: true}).setView([37.896, -110.509], 13);
 
        //var jjj = L.tileLayer('http://4umaps.eu/{z}/{x}/{y}.png', {
        //var jjj = L.tileLayer('http://localhost/tServer/api/dImg/{z}/{x}/{y}.png',{
        //notice: arcgisonline is z,y,x while the others are z,x,y
        //var jjj = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}.jpg',{
        var jjj = L.tileLayer('http://localhost/tServer/api/eImg/{z}/{y}/{x}.jpg',{
            attribution: 'lkjlkj',
            minZoom: 12,
            maxZoom: 15
        }).addTo(map);
        
        var i = 0;
        var myLayer = L.geoJson(trachyte, {
            onEachFeature: function (feature, layer) {
                console.log(feature, layer);
                feature.properties.index = i;
                i += 1;
                layer.on("click", function(e, g){
                    console.log(e.target);
                });
            }
        }).addTo(map);
        
    </script>
  </body>
</html>