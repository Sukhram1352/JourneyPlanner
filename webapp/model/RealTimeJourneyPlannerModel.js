sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {

	"use strict";

	return JSONModel.extend("journeyPlanner.JourneyPlanner.model.RealTimeJourneyPlannerModel", {
		
		/****************************************************************** */
		/* CONSTRUCTOR */
		/******************************************************************* */

		constructor: function () {
			JSONModel.apply(this, arguments);
			// Set Model structure
			this._setInitialModelStructure();
			this.setProperty("/", jQuery.extend(true, {}, this._oClientData));
		},
		
		/* =========================================================== */
		/* Private Methods                                             */
		/* =========================================================== */

		/**
		 * Function to set the RealTimeJourneyPlanner model structure
		 * @private
		 */
		_setInitialModelStructure: function() {
			this._oClientData = {
				MetroStations: [],
				NewJourneyClientCopy: {
					"TransId": "",
					"SFrom": "",
					"STo": ""
				},
				NewJourneyServerCopy: {
					"TransId": "",
					"SFrom": "",
					"STo": ""
				},
				JourneyRouteEmptyStructure: {
					"Route": "",
					"RouteId": "",
					"JourneyTime": "",
					"NormalFare": "",
					"ConcessionalFare": "",
					"NoOfStations": "",
					"NoOfInterChange": "",
					"Stations": [],
					"VariableStations": []
				},
				StationEmptyStructure: {
					"StationName": "",
					"InterChangeStation": false,
					"MetroLine": "",
					"StationCriticality": ""
				},
				JourneyRoutes: []
			};
		}
	});
});