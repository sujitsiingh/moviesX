sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox"
], (Controller, Filter, FilterOperator, MessageToast, Sorter, MessageBox) => {
    "use strict";

    return Controller.extend("movies.controller.Home", {
        onInit: function () {

        },

        // side toggle
        onCollapseExpandPress() {
			const oSideNavigation = this.byId("sideNavigation"),
				bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		},

        onAddMoviesPress: function () {
            this.hideAllPanels();
            var oPanel = this.byId("panel1");
            oPanel.setVisible(true);
        },

        onViewMoviesPress: function () {
            this.hideAllPanels();
            var oPanel = this.byId("panel2");
            oPanel.setVisible(true);
        },

        hideAllPanels: function () {
            const oPanel = this.byId("panel1");
            oPanel.setVisible(false);
            const oPanel1 = this.byId("panel2");
            oPanel1.setVisible(false);
        },



        onAddMe: function () {
            var title = this.getView().byId("_IDGenInput1").getValue();
            var overview = this.getView().byId("_IDGenInput2").getValue();
            var releaseYear = this.getView().byId("_IDGenInput3").getValue();
            var runtimeMin = this.getView().byId("_IDGenInput4").getValue();
            var numReviews = this.getView().byId("_IDGenInput5").getValue();

            const castRaw = this.byId("_IDGenInput6").getValue();
            const cast = castRaw ? castRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

            const payload = {
                title,
                overview,
                releaseYear,
                runtimeMin,
                numReviews,
                cast: cast
            }

            var oModel = this.getView().getModel();

            var oContext = oModel.bindList("/Movies").create(payload);

            oContext.created().then(() => {
                MessageBox.success("Movie Added Successfully");
                this.getView().byId("_IDGenInput1").setValue(null);
                this.getView().byId("_IDGenInput2").setValue(null);
                this.getView().byId("_IDGenInput3").setValue(null);
                this.getView().byId("_IDGenInput4").setValue(null);
                this.getView().byId("_IDGenInput5").setValue(null);
                this.getView().byId("_IDGenInput6").setValue(null);
            }).catch((err) => {
                MessageBox.error("error adding new movie");
                console.error("Error adding Item : " + err);
            });
        }

    });
});