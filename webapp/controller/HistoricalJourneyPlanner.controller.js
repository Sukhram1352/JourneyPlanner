sap.ui.define([
	"journeyPlanner/JourneyPlanner/controller/BaseController",
	"journeyPlanner/JourneyPlanner/model/formatter",
	"sap/ui/model/json/JSONModel",
	"journeyPlanner/JourneyPlanner/util/Utility",
	"journeyPlanner/JourneyPlanner/controller/ErrorHandler"
], function (BaseController, formatter, JSONModel, Utility, ErrorHandler) {
	"use strict";

	return BaseController.extend("journeyPlanner.JourneyPlanner.controller.HistoricalJourneyPlanner", {
		
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			this._oErrorHandler = new ErrorHandler(this.getOwnerComponent());
			
			var oHistoricalJourneyPlannerModel = new JSONModel();
			this.getView().setModel(oHistoricalJourneyPlannerModel, "HistoricalJourneyPlanner");
			
			this.getOwnerComponent().getModel().read("/StationNameSet", {
				success: function (oData) {
					var aMetroStstions = Utility.sanitizeEntitySetResult(oData, false);
					this.getView().getModel("HistoricalJourneyPlanner").setProperty("/MetroStations",
						jQuery.extend(true, [], aMetroStstions));
				}.bind(this),
				error: function (oError) {
					this._oErrorHandler(oError);
				}.bind(this)
			});
		}
	});
});