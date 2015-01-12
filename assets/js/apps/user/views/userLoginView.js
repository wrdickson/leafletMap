//userLoginView.js

define([
    'marionette',
    'tpl!apps/user/templates/userLogin.tpl',
    'common/dispatch',
    'jquery-ui'
], function (
    Marionette,
    userLogin,
    dispatch
) {
    'use strict';
    var baseUrl;
    
    var UserLoginView = Marionette.ItemView.extend({
        template: userLogin,
        initialize: function () {
            baseUrl = dispatch.request("MapApp:getBaseUrl");
        },
		events: {
			"click button#btnLogin": function () {
                var self = this;
				var param = {
					username: $("#loginUsername").val(),
					password: $("#loginPassword").val()
				};
                $.ajax({
                    url: baseUrl + "api/login/",
                    type: "GET",
                    data: param,
                    success: function (data) {
                        //TODO: handle a failed login, not just error as below
                        if(JSON.parse(data).id > 0){
                            dispatch.trigger("MapApp:setUser", JSON.parse(data));
                            self.closeDialog();
                        } else { //login failed
                            //TODO: handle failure
                        }
                    },
                    error: function (error) {
                    
                    }
                });
			},
            "click button#btnCancelLogin": function () {
                this.closeDialog();
            }
		},
        closeDialog: function () {
            this.stopListening();
            dispatch.trigger("MapApp:resetDialogRegion");
        },
        onShow: function () {
            var self = this;
            //apply jqueryUi to buttons
			var dialogOpts = {
				modal: true,
				title: "Login . . .",
                close: function () {
                    self.closeDialog();
                }
			};
			this.$el.dialog(dialogOpts);
			$(".btn").button();
        } 
    });
    return UserLoginView;
});