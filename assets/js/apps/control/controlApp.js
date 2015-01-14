//controlapp.js
define([
    'backbone',
    'apps/control/menu',
    'apps/control/views/showAllMaps',
    'common/dispatch',
    'jquery-ui'

], function(
    Backbone,    
    Menu,
    ShowAllMapsView,
    dispatch

){


var user;
var mapModel;

//take the map model and turn the mapJson attribute into a Backbone collection
var buildFeaturesModel = function(){
    var mFeature = Backbone.Model.extend({});
    var mFeatures = Backbone.Collection.extend({
        model: mFeature,
        comparator: function(mFeature){return mFeature.get("geometry").type;}
    });         
    var features = new mFeatures();
    var featuresJson = ControlApp.mapModel.get("mapJson");
    var index = 0;
    $.each(featuresJson.features, function(i,v){
        var iFeature = new mFeature();
        //set an index property on the model
        iFeature.set("index",index);
        iFeature.set("geometry",v.geometry);
        iFeature.set("properties",v.properties);
        index++;
        features.add(iFeature);	
    });
    return features;        
}

var showAllMaps = function () {
    var showAllMapsView;
    var iMap = Backbone.Model.extend({}); 
    var AllMapsCollection = Backbone.Collection.extend({
        model: iMap,
        comparator: function(iMap) { return iMap.get('name').toLowerCase(); }
    });
    var allMapsCollection = new AllMapsCollection();
    
    
    var mapsCollection;
    //fire the query to the api
    $.ajax({
        type: 'get',
        url: "http://localhost/mapProject/api/allMaps",
        success: function (data){
            //build the collection
            $.each(JSON.parse(data), function (i, v) {
                var jMap = new iMap(v);
                allMapsCollection.add(jMap);
            });
            //instantiate the view
            var showAllMapsView = new ShowAllMapsView();
            showAllMapsView.collection = allMapsCollection;
            console.log("aMC:", allMapsCollection);
            //have map App burn it
            dispatch.trigger("MapApp:showDialogView", showAllMapsView);
        },
        error: function (data) {
        
        }    
    });
    
    //instantiate a showAllMapsView
    showAllMapsView = new ShowAllMapsView();
    console.log("sAMV:", showAllMapsView);
    //apply the model
    
    //send it to MapApp to burn into the DOM
    
};

var ControlApp = {};

function fireJqueryUi () {
    $("#mtoControl").show("slow");

    $("#mtoControl").draggable({
        handle: "#mtoControlUpper"	
    });
    
    $("#controlTabs").tabs();
    //initailly disable detail tab
    $("#controlTabs").tabs("option", "disabled", [2]);
    
    $("#controlTabs").on("tabsactivate", function(event,ui){
        activeTab = $("#controlTabs").tabs("option","active");
        //reset selected if user clicks map or features tab 
        if(activeTab < 2){
            selectedFeatureIndex = -1;
            //tell map to unselect all
                //reqres.trigger("control:unselectFeature");
            //disable tab2 (detail)
            $("#controlTabs").tabs("option", "disabled", [2]);
        }
    });
    
    $( "#mtoControl" ).resizable({
        handles: "e"
    });
    
    $("#mtoLogoa").tooltip({
        content: "Drag me . . ."
    });
    
    //debug . . .
    $("#btnDemo").button({
        icons: {
            primary: "ui-icon-minusthick"
        },
        text: false,
        label: 'Minimize'
    });
}

ControlApp.initialize = function(user){

    //set the private property
    user = user;
    console.log(user);
    
    //burn the jquery ui onto the control
    fireJqueryUi();    
    Menu.fireMenu(user);   
}

dispatch.on("control:showAllMaps", function () {
    showAllMaps();
});

return ControlApp;
});