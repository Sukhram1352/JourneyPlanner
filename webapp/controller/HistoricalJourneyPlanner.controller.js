sap.ui.define([
	"journeyPlanner/JourneyPlanner/controller/BaseController",
	"journeyPlanner/JourneyPlanner/model/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
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
			var oHistoricalJourneyPlannerModel = new JSONModel();
			this.getView().setModel(oHistoricalJourneyPlannerModel, "HistoricalJourneyPlanner");
		}
	});
});