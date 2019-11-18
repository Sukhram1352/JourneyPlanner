sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {

	"use strict";

	return JSONModel.extend("journeyPlanner.JourneyPlanner.model.HistoricalJourneyPlannerModel", {
		
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
		 * Function to set the HistoricalJourneyPlanner model structure
		 * @private
		 */
		_setInitialModelStructure: function() {
			this._oClientData = {
				NewStationClientCopy: {
					"Station": "",
					"Day": ""
				},
				Days: [{
					"Day_Text": "Sunday"
				},{
					"Day_Text": "Monday"
				},{
					"Day_Text": "Tuesday"
				},{
					"Day_Text": "Wednesday"
				},{
					"Day_Text": "Thursday"
				},{
					"Day_Text": "Friday"
				},{
					"Day_Text": "Saturday"
				}],
				FullScreenPageBusy: false,
				EmptyVBoxVisiblity: true,
				CrowdData: []
			};
		}
	});
});