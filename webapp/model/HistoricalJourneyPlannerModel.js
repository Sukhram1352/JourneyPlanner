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
				NewJourneyClientCopy: {},
				NewJourneyServerCopy: {}
			};
		}
	});
});