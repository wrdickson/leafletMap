//showAllMaps.js
define([
    'marionette',
    'common/dispatch',
    'tpl!apps/control/templates/allMapsComposite.tpl',
    'tpl!apps/control/templates/allMapsItem.tpl',
    'jquery-ui'

], function (
    Marionette,
    dispatch,
    allMapsCompositeTemplate,
    allMapsItemTemplate
) {
    "use strict";
    //private vars
    var mapInfoView = Backbone.Marionette.ItemView.extend({
        template: allMapsItemTemplate,
        className: 'allMapsRow',
        tagName: 'tr',
        events: {
            click: function () {
                console.log(this.model.get("id"));
                dispatch.trigger("MapApp:loadMap", this.model.get("id"));
                //dispatch.trigger("MapApp:resetDialogRegion");
                
            }
        }
    });
    
    var ShowAllMapsView = Backbone.Marionette.CompositeView.extend({
        template: allMapsCompositeTemplate,
        childView: mapInfoView,
        childViewContainer: 'tbody',
        closeDialog: function () {
            this.stopListening();
            dispatch.trigger("MapApp:resetDialogRegion");
        },
        events:{
            "mouseover .allMapsRow": function (e) {
                $(e.currentTarget).addClass("controlHighlight");
            },
            "mouseout .allMapsRow": function (e) {
                $(e.currentTarget).removeClass("controlHighlight");
            }        
        },
        onShow: function () {
            var self = this;
			var dialogOpts = {
				modal: true,
                position: 'left top',
                width: '600px',
				title: "All Maps . . .",
                close: function () {
                    self.closeDialog();
                }
			};
			this.$el.dialog(dialogOpts);
			$(".btn").button();        
        }
    });
    
    return ShowAllMapsView;

});