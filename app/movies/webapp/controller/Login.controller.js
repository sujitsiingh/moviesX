sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/MessageToast",
    'sap/ui/export/Spreadsheet',
    'sap/ui/export/library'
], (Controller, MessageBox, Fragment, JSONModel, Sorter, Filter, FilterOperator, FilterType, MessageToast, Spreadsheet, exportLibrary) => {
    "use strict";
    return Controller.extend("movies.controller.Login", {
        onInit: function () {
            // sap.ui.getCore().applyTheme("sap_horizon");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteHome").attachPatternMatched(this._onObjectMatched, this);

            // Initialize the model
            var oUserModel = new JSONModel();
            this.getView().setModel(oUserModel, "userModel");
        },
        _onObjectMatched: function (oEvent) {
            var un = oEvent.getParameter("arguments").name;
            var pwd = oEvent.getParameter("arguments").pass;
            var oUserModel = this.getView().getModel("userModel");
            oUserModel.setProperty("/username", un);
            oUserModel.setProperty("/password", pwd);
        },
        alertButton: function () {
            let username = this.getView().byId("un").getValue();
            let password = this.getView().byId("pwd").getValue();
            MessageBox.success("Username : " + username + " \nPassword : " + password);
        },

        // <---- Login ---->
        onNavigateToList: function () {
            let username = this.getView().byId("un").getValue();
            let password = this.getView().byId("pwd").getValue();

            if ( !username || !password ) MessageBox.error("Username/Password cant be empty!");
            else {
                var oModel2 = this.getOwnerComponent().getModel();
                let aFilters = [
                    new Filter("username", FilterOperator.EQ, username),
                    new Filter("password", FilterOperator.EQ, password)
                ];
                let oBinding = oModel2.bindList("/Users", undefined, undefined, undefined, {
                    $$groupId: "$direct"
                });
                oBinding.filter(aFilters);
                oBinding.requestContexts().then((aContexts) => {
                    if (aContexts.length > 0) {
                        aContexts.forEach((oContext) => {
                            let oUser = oContext.getObject();
                            console.log("User found:", oUser);
                            // alert("Welcome, " + oUser.username);
                        });
                        // Navigate to the next view if credentials are valid
                        sessionStorage.setItem("loggedIn", "true");
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("RouteHome", {
                            name: username,
                            pass: password
                        });

                    } else {
                        MessageBox.error("Invalid Username/Password");
                    }
                }).catch((err) => {
                    console.error("Error fetching data: ", err);
                    MessageBox.error("An error occurred while fetching data. Please try again.");
                });
            }
        }




    });
});