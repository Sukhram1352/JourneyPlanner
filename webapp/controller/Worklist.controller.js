sap.ui.define([
	"journeyPlanner/JourneyPlanner/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"journeyPlanner/JourneyPlanner/model/formatter",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/m/MessageStrip",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, MessageToast, MessageStrip, FilterOperator) {
	"use strict";

	return BaseController.extend("journeyPlanner.JourneyPlanner.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel;

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

		},
		
		onRealTimeTilePress : function(oEvent) {
			this.getRouter().navTo("realTimeJourneyPlanner", {});
		},
		
		onHistoryTilePress : function(oEvent) {
			this.getRouter().navTo("historicalJourneyPlanner", {
				"StationName":"*"
			});
		}
	});
});