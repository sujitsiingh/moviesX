sap.ui.define([
    "sap/ui/core/UIComponent",
    "movies/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("movies.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        /**
         * @public
         * @override
         */

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            this.getRouter().attachRouteMatched(this._onRouteMatched, this);

        },

        _onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            if(sRouteName !== "RouteLogin" && sessionStorage.getItem("loggedIn") !== "true") {
                this.getRouter().navTo("RouteLogin");
            }
        }
    });
});