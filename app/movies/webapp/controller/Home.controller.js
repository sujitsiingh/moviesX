sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/SelectDialog",
    "sap/m/StandardListItem",
    "sap/ui/core/Theming",
    "sap/ui/model/json/JSONModel"
], (Controller, Filter, FilterOperator, MessageToast, Sorter, MessageBox, Fragment, SelectDialog, StandardListItem, Theming, JSONModel) => {
    "use strict";

    return Controller.extend("movies.controller.Home", {
        onInit: function () {

            // const aThemes = [
            //     { id: "sap_horizon", text: "Morning Horizon (Light)", icon: "sap-icon://light-mode" },
            //     { id: "sap_horizon_dark", text: "Evening Horizon (Dark)", icon: "sap-icon://dark-mode" },
            //     { id: "sap_horizon_hcw", text: "High Contrast White", icon: "sap-icon://contrast" },
            //     { id: "sap_horizon_hcb", text: "High Contrast Black", icon: "sap-icon://contrast" }
            // ];

            // const saved = localStorage.getItem("themeId");
            // if (saved && saved !== Theming.getTheme()) {
            //     Theming.setTheme(saved);
            // }


            // this.getView().setModel(new JSONModel({
            //     themes: aThemes,
            //     current: Theming.getTheme()
            // }), "theming");
        },

        // side toggle
        onCollapseExpandPress() {
            const oSideNavigation = this.byId("sideNavigation"),
                bExpanded = oSideNavigation.getExpanded();

            oSideNavigation.setExpanded(!bExpanded);
        },

        // theme switching..
        onMenuItem: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            if (!oItem) {
                MessageToast.show("No Item");
                return;
            }
            var sKey = oItem && oItem.getKey ? oItem.getKey() : "";
            var sText = oItem && oItem.getText ? oItem.getText() : "";
            if (!sKey && oItem && oItem.data) {
                sKey = oItem.data("action") || oItem.data("action1") || oItem.data("action2") || oItem.data("action3") || "";
            }
            console.log("menu selected:", { key: sKey, text: sText });

            if (!sKey) {
                MessageToast.show("No actions");
                return;
            }

            switch (sKey || sText) {

                case "onThemeMH": this._setTheme("sap_horizon");
                    MessageToast.show("Theme: Morning Horizon");
                    break;

                case "onThemeEve": this._setTheme("sap_horizon_dark");
                    MessageToast.show("Theme: Evening Horizon");
                    break;

                case "onThemeQL": this._setTheme("sap_fiori_3");
                    MessageToast.show("Theme: Quartz Light");
                    break;

                case "onThemeQD": this._setTheme("sap_fiori_3_dark");
                    MessageToast.show("Theme: Quartz Dark");
                    break;

                default: MessageToast.show("Unknown action: " + sKey);
            }
        },

        _setTheme: function (sThemeId) {
            Theming.setTheme(sThemeId);
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

        // <---- edit press => open a panel 3 ---->
        onEditPressed: function () {
            this.hideAllPanels();
            var oPanel = this.byId("panel3");
            oPanel.setVisible(true);
        },

        hideAllPanels: function () {
            const oPanel = this.byId("panel1");
            oPanel.setVisible(false);
            const oPanel2 = this.byId("panel2");
            oPanel2.setVisible(false);
            const oPanel3 = this.byId("panel3");
            oPanel3.setVisible(false);
        },



        onAddMe: function () {
            var title = this.getView().byId("_IDGenInput1").getValue();
            var overview = this.getView().byId("_IDGenInput2").getValue();
            var releaseYear = this.getView().byId("_IDGenInput3").getValue();
            var runtimeMin = this.getView().byId("_IDGenInput4").getValue();
            var numReviews = this.getView().byId("_IDGenInput5").getValue();

            const castRaw = this.byId("_IDGenInput6").getValue();
            const cast = castRaw ? castRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

            // var currency = this.getView().byId("_IDGenInput7").getValue().toUpperCase();
            const currency = (this.getView().byId("_IDGenInput7").getValue() || "").trim().toUpperCase();


            const payload = {
                title,
                overview,
                releaseYear,
                runtimeMin,
                numReviews,
                cast: cast,
                currency: { code: currency }
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
                this.getView().byId("_IDGenInput7").setValue(null);
            }).catch((err) => {
                MessageBox.error("error adding new movie");
                console.error("Error adding Item : " + err);
            });
        },

        formatCast: function (aCast) {
            return Array.isArray(aCast) ? aCast.join(', ') : '';
        },

        // currency filtering f4 help
        onCurrencyVH: function (oEvent) {
            const oModel = this.getView().getModel();

            if (!this._oCurrencyDlg) {
                this._oCurrencyDlg = new SelectDialog({
                    title: "Select Currency",
                    // Filter as user types
                    liveChange: this.onCurrencySearch.bind(this),
                    search: this.onCurrencySearch.bind(this),
                    confirm: (e) => {
                        const oItem = e.getParameter("selectedItem");
                        if (oItem) {
                            const sCode = oItem.getBindingContext().getProperty("code");
                            this.byId("_IDGenInput7").setValue(sCode);
                        }
                        e.getSource.close();
                    },
                    cancel: (e) => e.getSource.close()
                });

                this._oCurrencyDlg.setBusyIndicatorDelay(0);
                this.getView().addDependent(this._oCurrencyDlg);


                // Bind items to /Currencies with minimal $select
                this._oCurrencyDlg.bindAggregation("items", {
                    path: "/Currencies",
                    parameters: { $select: "code,name,symbol" },
                    template: new StandardListItem({
                        title: "{code}",
                        description: "{name}", // shows currency name
                        info: "{symbol}"       // e.g., ₹, $, €
                    }),
                    templateShareable: false
                });
            }
            this._oCurrencyDlg.open();
        },

        onCurrencySearch: function (oEvent) {
            const sQuery = (oEvent.getParameter("value") || "").trim();
            const oBinding = oEvent.getSource().getBinding("items");
            const aFilters = [];

            if (sQuery) {
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("code", FilterOperator.Contains, sQuery.toUpperCase()),
                            new Filter("name", FilterOperator.Contains, sQuery)
                        ],
                        and: false // OR
                    })
                );
            }

            oBinding.filter(aFilters);
        },



        onActionPress: function (oEvent) {
            var oBtn = oEvent.getSource();
            var oContext = oBtn.getBindingContext();
            this._oSelectedContext = oContext;

            if (!this._oActionSheet) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "movies.view.ActionSheet",
                    controller: this
                })
                    .then(function (oActionSheet) {
                        this._oActionSheet = oActionSheet;
                        this.getView().addDependent(this._oActionSheet);
                        this._oActionSheet.openBy(oBtn);
                    }.bind(this));
            } else {
                this._oActionSheet.openBy(oBtn);
            }
        },

        onDeletePress: function () {
            var oContext = this._oSelectedContext;
            var sMovieId = oContext.getProperty("ID");
            MessageBox.confirm("Are you sure to delete this movie with ID: " + sMovieId + " ?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        // ---- to delete ---
                        oContext.delete("$direct").then(function () {
                            MessageBox.success("Movie ID: " + sMovieId + " successfully Deleted!!");
                        })
                            .catch(function (e) {
                                MessageBox.error("Error deleting the movie with ID: " + sMovieId + " err :" + e + " Try again!");
                            })
                    }
                }
            });
        },

        onEditPress: function () {
            var oData = this._oSelectedContext.getObject();
            MessageToast.show("Edit your entries for Movie ID: " + oData.ID);
            this.onEditPressed();  // ->panel func will triger
            var pdt_model = this.getOwnerComponent().getModel();
            let aFilters = [
                new Filter("ID", FilterOperator.EQ, oData.ID)
            ];
            let oBind = pdt_model.bindList("/Movies");
            oBind.filter(aFilters);

            oBind.requestContexts().then((aContexts) => {
                // handle retrieved contexts..
                if (aContexts.length > 0) {
                    aContexts.forEach(oContext => {
                        let oUser = oContext.getObject();
                        this.getView().byId("editTitle").setValue(oUser.title);
                        this.getView().byId("editOverview").setValue(oUser.overview);
                        this.getView().byId("editReleaseYear").setValue(oUser.releaseYear);
                        this.getView().byId("editRunTime").setValue(oUser.runtimeMin);
                        this.getView().byId("editReviews").setValue(oUser.numReviews);
                        this.getView().byId("editCast").setValue(oUser.cast);
                        this.getView().byId("editCurrency").setValue(oUser.currency_code);
                        this.getView().byId("itemCode").setValue(oUser.ID);
                    });
                } else {
                    MessageBox.error("No Movie found with specified ID");
                }
            })
                .catch(e => {
                    MessageBox.error("Error retrieving Movies details: " + e)
                });

        },

        onEditMe: function () {
            var itemCode = this.getView().byId("itemCode").getValue();

            var title = this.getView().byId("editTitle").getValue();
            var overview = this.getView().byId("editOverview").getValue();
            var releaseYear = this.getView().byId("editReleaseYear").getValue();
            var runtimeMin = this.getView().byId("editRunTime").getValue();
            var numReviews = this.getView().byId("editReviews").getValue();
            var cast = this.getView().byId("editCast").getValue();
            var currency = this.getView().byId("editCurrency").getValue();

            var update_oModel = this.getView().getModel();
            var sPath = "/Movies('" + itemCode + "')";
            var oBinding = update_oModel.bindContext(sPath);
            var oContext = oBinding.getBoundContext();

            var oView = this.getView();
            function resetBusy() {
                oView.setBusy(false);
            }
            oView.setBusy(true);

            oContext.setProperty("title", title);
            oContext.setProperty("overview", overview);
            oContext.setProperty("releaseYear", releaseYear);
            oContext.setProperty("runtimeMin", runtimeMin);
            oContext.setProperty("numReviews", numReviews);
            oContext.setProperty("cast", cast);
            oContext.setProperty("currency", currency);

            update_oModel.submitBatch("auto").then(function () {
                resetBusy();
                MessageBox.success("Movie details updated successfully!");
            }).catch(function (e) {
                resetBusy();
                MessageBox.error("An error occured while updating details..:" + e);
            })
        },

        // (layout helper)
        // createGridLayout: function () {
        //     return new sap.f.GridContainerSettings({
        //         rowSize: "5rem",
        //         columnSize: "14rem",
        //         gap: "1rem"
        //     });
        // }



    });
});
