//app.js
define([
    'backbone',
    'marionette',
    'apps/control/controlApp',
    'apps/user/userApp',
    'apps/lMap/lMap',
    'common/dispatch',
    'jquery'
], function (
    Backbone,
    Marionette,
    ControlApp,    
    UserApp,
    LMap,
    dispatch
) {
	'use strict';
    //this is where we get the evil global variables from php
    //kneel down and vow that globals will never be accessed or created again
    var baseUrl = mtoBaseUrl;
    //and we do it again for mtoUser
    var user = new UserApp.User(mtoUser);
    console.log('user@init:',user);
    var router;
    
    
    var MapModel = Backbone.Model.extend({
        urlRoot: "http://localhost/mapProject/api/maps",
        initialize: function(){
            var self = this;
            this.on("change", function(){
    
            });
            this.on("sync", function(){

            });
            
        }   
    });
    var mapModel;
    

    
    var handleUserChange = function(){
        //reburn control
        ControlApp.initialize(user);
        //reload map
        
    };
    
    //bit of a hack to keep the map full screen
    $("#leafletMap").css("height", document.documentElement.clientHeight);            
    $(window).resize(function(){
        $("#leafletMap").css("height", document.documentElement.clientHeight);
    });    
    
    var MapApp = new Marionette.Application;
    
	MapApp.addRegions({
		mainRegion: "#main-region",
        menuRegion: "#menu-region",
        dialogRegion: "#dialog-region",
        mapRegion: "#map-canvas",
        //see http://lostechies.com/derickbailey/2012/04/17/managing-a-modal-dialog-with-backbone-and-marionette/ 
        //for derick baily's discussion of wrapping the modal 
        modalRegion: "#modal-region",
        mapInfoRegion: "#mapInfo",
        mapFeaturesRegion: "#mapFeatures",
        featureDetailInfoRegion: "#featureDetailInfo",
        featureDetailCoordsRegion: "#featureDetailCoords"
	});
    MapApp.loadMap = function (id) {
        mapModel = new MapModel({
            id: id
        });
        mapModel.fetch({
            success: function (model, response, options){
                MapApp.router.navigate("maps/" + id);
                dispatch.trigger("mapModel:loaded", model, user);
            }
        });
    }
	MapApp.on("start", function () {
        MapApp.baseUrl = baseUrl;
        
        UserApp.initialize(user);        
        ControlApp.initialize(user);
        LMap.initialize(user);        
        
        //start by defining the router and controller
        var RouteController = Marionette.Controller.extend({
            loadDefaultMap: function () {
                console.log("loading default map");
            },  
            loadMap: function (id) {
                console.log("loadMap", id);
                mapModel = new MapModel();
                mapModel.set("id", id);
                mapModel.fetch({
                    success: function (model, response, options) {
                        //burn the map . . .
                        dispatch.trigger("mapModel:loaded", model, user);
                    },
                    error: function (model, response, options) {
                    }
                });
            }
        });
        var routeController = new RouteController();
        MapApp.router = new Marionette.AppRouter({
            controller: routeController,
            appRoutes: {
                "": "loadDefaultMap",
                "maps/:id": "loadMap"
            }
        });
        //ONLY after the routers are instantiated to we start Backbone.history
        if (Backbone.history) { 
            Backbone.history.start({
                pushState: true,
                root: "mapProject"
            });
        }
        //MapApp.router.navigate("something/else"); //works

	});
    
    dispatch.setHandler("MapApp:getBaseUrl", function () {
        return baseUrl;
    });    
        
    dispatch.on("menu:showLogin", function () {
        UserApp.userLoginView = new UserApp.UserLoginView();
        MapApp.dialogRegion.show(UserApp.userLoginView);
    });
    dispatch.on("MapApp:resetDialogRegion", function () {
        MapApp.dialogRegion.reset();
    });

    dispatch.on("MapApp:setUser", function (data) {
        user.set({
            mtoUserId: data.id,
            mtoUserKey: data.key,
            mtoUserPerm: data.permission,
            mtoUserName: data.username
        });
        handleUserChange();
    });
    dispatch.on("MapApp:showDialogView", function (view) {
        MapApp.dialogRegion.show(view);
    });
    dispatch.on("MapApp:loadMap", function (id) {
        MapApp.loadMap(id);
    });
	return MapApp;
});
