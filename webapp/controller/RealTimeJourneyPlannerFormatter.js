/* eslint-disable max-params */
sap.ui.define([], function() {
	/* eslint-enable max-params */
	"use strict";
	return {

		/******************************************************************* */
		/* PUBLIC METHODS */
		/******************************************************************* */
		
		/**
		 * Formatter method to handle circle color
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    bInterChangeStation       Whether it is an Inter Change Station or not
		 * @param   {string}     sStationCriticality       Station Criticality
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Red Circle
		 */
		formatJourneyRouteRedCircle: function(sStationName, bInterChangeStation, sStationCriticality) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if ((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) &&
				(sStationCriticality === "RED" || sStationCriticality === "Red")) {
				return true;
			}

			return false;
		},
		
		/**
		 * Formatter method to handle circle color
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    bInterChangeStation       Whether it is an Inter Change Station or not
		 * @param   {string}     sStationCriticality       Station Criticality
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Green Circle
		 */
		formatJourneyRouteGreenCircle: function(sStationName, bInterChangeStation, sStationCriticality) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if ((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) &&
				(sStationCriticality === "GREEN" || sStationCriticality === "Green")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle circle color
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    bInterChangeStation       Whether it is an Inter Change Station or not
		 * @param   {string}     sStationCriticality       Station Criticality
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Red Circle
		 */
		formatJourneyRouteYellowCircle: function(sStationName, bInterChangeStation, sStationCriticality) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if ((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) &&
				(sStationCriticality === "YELLOW" || sStationCriticality === "Yellow")) {
				return true;
			}

			return false;
		},
		
		/**
		 * Formatter method to handle circle color
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    bInterChangeStation       Whether it is an Inter Change Station or not
		 * @param   {string}     sStationCriticality       Station Criticality
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Grey Circle
		 */
		formatJourneyRouteGreyCircle: function(sStationName, bInterChangeStation, sStationCriticality) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if (sStationName !== sFromStation && sStationName !== sToStation && !bInterChangeStation) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Red Icon circle 
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    bInterChangeStation       Whether it is an Inter Change Station or not
		 * @param   {string}     sStationCriticality       Station Criticality
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of VBox
		 */
		formatJourneyRouteRedIconCircle: function(sStationName, bInterChangeStation, sStationCriticality) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if ((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) &&
				(sStationCriticality === "RED" || sStationCriticality === "Red")) {
				return true;
			}

			return false;
		},
		
		/**
		 * Formatter method to handle visiblity of Green Icon circle 
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    bInterChangeStation       Whether it is an Inter Change Station or not
		 * @param   {string}     sStationCriticality       Station Criticality
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of VBox
		 */
		formatJourneyRouteGreenIconCircle: function(sStationName, bInterChangeStation, sStationCriticality) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if ((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) &&
				(sStationCriticality === "GREEN" || sStationCriticality === "Green")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Yellow Icon circle 
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    bInterChangeStation       Whether it is an Inter Change Station or not
		 * @param   {string}     sStationCriticality       Station Criticality
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of VBox
		 */
		formatJourneyRouteYellowIconCircle: function(sStationName, bInterChangeStation, sStationCriticality) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if ((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) &&
				(sStationCriticality === "YELLOW" || sStationCriticality === "Yellow")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Normal Icon circle 
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    bInterChangeStation       Whether it is an Inter Change Station or not
		 * @param   {string}     sStationCriticality       Station Criticality
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of VBox
		 */
		formatJourneyRouteNormalIconCircle: function(sStationName, bInterChangeStation, sStationCriticality) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if (!bInterChangeStation && sStationName !== sFromStation && sStationName !== sToStation) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Red Connection Line
		 * @param   {string}     sStationName              Station Name
		 * @param   {string}     sMetroLineColor           Metro Line
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Connection Line
		 */
		formatJourneyRouteFromStationRedLine: function(sStationName, sMetroLineColor) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");

			if ((sStationName !== sToStation) && (sMetroLineColor === "RED" || sMetroLineColor === "Red")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Blue Connection Line
		 * @param   {string}     sStationName              Station Name
		 * @param   {string}     sMetroLineColor           Metro Line
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Connection Line
		 */
		formatJourneyRouteFromStationBlueLine: function(sStationName, sMetroLineColor) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");

			if ((sStationName !== sToStation) && (sMetroLineColor === "BLUE" || sMetroLineColor === "Blue")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Green Connection Line
		 * @param   {string}     sStationName              Station Name
		 * @param   {string}     sMetroLineColor           Metro Line
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Connection Line
		 */
		formatJourneyRouteFromStationGreenLine: function(sStationName, sMetroLineColor) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");

			if ((sStationName !== sToStation) && (sMetroLineColor === "GREEN" || sMetroLineColor === "Green")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Violet Connection Line
		 * @param   {string}     sStationName              Station Name
		 * @param   {string}     sMetroLineColor           Metro Line
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Connection Line
		 */
		formatJourneyRouteFromStationVioletLine: function(sStationName, sMetroLineColor) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");

			if ((sStationName !== sToStation) && (sMetroLineColor === "VIOLET" || sMetroLineColor === "Violet")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Orange Connection Line
		 * @param   {string}     sStationName              Station Name
		 * @param   {string}     sMetroLineColor           Metro Line
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Connection Line
		 */
		formatJourneyRouteFromStationOrangeLine: function(sStationName, sMetroLineColor) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");

			if ((sStationName !== sToStation) && (sMetroLineColor === "ORANGE" || sMetroLineColor === "Orange")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Pink Connection Line
		 * @param   {string}     sStationName              Station Name
		 * @param   {string}     sMetroLineColor           Metro Line
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Connection Line
		 */
		formatJourneyRouteFromStationPinkLine: function(sStationName, sMetroLineColor) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");

			if ((sStationName !== sToStation) && (sMetroLineColor === "PINK" || sMetroLineColor === "Pink")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Yellow Connection Line
		 * @param   {string}     sStationName              Station Name
		 * @param   {string}     sMetroLineColor           Metro Line
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Connection Line
		 */
		formatJourneyRouteFromStationYellowLine: function(sStationName, sMetroLineColor) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");

			if ((sStationName !== sToStation) && (sMetroLineColor === "YELLOW" || sMetroLineColor === "Yellow")) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Icon Bottom Text
		 * @param   {string}     sStationName              Station Name
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Icon Bottom Text
		 */
		formatIconBottomFromStationText: function(sStationName) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sFromStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/SFrom");

			if (sStationName === sFromStation) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Icon Bottom Text
		 * @param   {string}     sStationName              Station Name
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Icon Bottom Text
		 */
		formatIconBottomToStationText: function(sStationName) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");

			if (sStationName === sToStation) {
				return true;
			}

			return false;
		},

		/**
		 * Formatter method to handle visiblity of Icon Bottom Text
		 * @param   {string}     sStationName              Station Name
		 * @param   {string}     bInterChangeStation       Whether it is an Inter Change Station or not
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Icon Bottom Text
		 */
		formatIconBottomNormalText: function(sStationName, bInterChangeStation) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sFromStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/SFrom");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");

			if (sStationName !== sFromStation && sStationName !== sToStation && !bInterChangeStation) {
				return true;
			}

			return false;
		},
		
		/**
		 * Formatter method to handle visiblity of Start and End Metro Icons
		 * @param   {string}     sStationName              Station Name
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Metro Icons
		 */
		formatJourneyRouteFromToMetroIcon: function(sStationName) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if (sStationName === sFromStation || sStationName === sToStation) {
				return true;
			}

			return false;
		},
		
		/**
		 * Formatter method to handle visiblity of Intermediate Metro Icons
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    bInterChangeStation       Whether it is an Inter Change Station or not
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Metro Icons
		 */
		formatJourneyRouteInterMediateMetroIcon: function(sStationName, bInterChangeStation) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourneyServerData = jQuery.extend(true, {},
				oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var sFromStation = oNewJourneyServerData.SFrom;
			var sToStation = oNewJourneyServerData.STo;

			if (sStationName !== sFromStation && sStationName !== sToStation && !bInterChangeStation) {
				return true;
			}

			return false;
		}
	};
});