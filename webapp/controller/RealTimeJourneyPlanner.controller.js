sap.ui.define([
	"journeyPlanner/JourneyPlanner/controller/BaseController",
	"journeyPlanner/JourneyPlanner/model/formatter",
	"journeyPlanner/JourneyPlanner/model/RealTimeJourneyPlannerModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"journeyPlanner/JourneyPlanner/controller/ErrorHandler",
	"journeyPlanner/JourneyPlanner/util/Utility"
], function (BaseController, formatter, RealTimeJourneyPlannerModel, Filter, FilterOperator, ErrorHandler, Utility) {
	"use strict";

	return BaseController.extend("journeyPlanner.JourneyPlanner.controller.RealTimeJourneyPlanner", {
		
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the RealTimeJourneyPlanner controller is instantiated.
		 * @public
		 */
		onInit: function () {
			this._oErrorHandler = new ErrorHandler(this.getOwnerComponent());
			
			var oRealTimeJourneyPlannerModel = new RealTimeJourneyPlannerModel();
			this.getView().setModel(oRealTimeJourneyPlannerModel, "RealTimeJourneyPlanner");
			
			this.getOwnerComponent().getModel().read("/StationNameSet", {
				success: function(oData) {
					var aMetroStstions = Utility.sanitizeEntitySetResult(oData, false);
					this.getView().getModel("RealTimeJourneyPlanner").setProperty("/MetroStations", 
						jQuery.extend(true, [], aMetroStstions));
				}.bind(this),
				error: function(oError) {
					this._oErrorHandler(oError);
				}.bind(this)
			});
		},
		
		/**
		 * Called when the RealTimeJourneyPlanner controller is terminated.
		 * @public
		 */
		onExit:function() {
		    if (this.intervalHandle) {
				clearInterval(this.intervalHandle);
		    }
		},
		
		/**
		 * Called when the RealTimeJourneyPlanner controller is rendered.
		 * @public
		 */
		onAfterRendering: function() {
			var myOptions = {zoom:12,
			                 center:new google.maps.LatLng(20,77),
			                 mapTypeId: google.maps.MapTypeId.ROADMAP
			                 };
			var map = new google.maps.Map(this.getView().byId("idGoogleMapTrial").getDomRef(), myOptions);
			this._oDirectionsRenderer = new google.maps.DirectionsRenderer({
				map: map
			});
			this._oDirectionsService = new google.maps.DirectionsService;
		    this._oDirectionsRenderer.setMap(map);
		    
		 //   var oRequest = {
			// 	origin: oNewJourney.SFrom,
			// 	destination: oNewJourney.STo,
			// 	travelMode: "DRIVING"
			// };
			
			// this._oDirectionsService.route(oRequest, function(oResponse, sStatus) {
			// 	if (sStatus === "OK") {
			// 		this._oDirectionsRenderer.setDirections(oResponse);
			// 	}
			// });
		},
		
		/**
		 * Function is called on Back Navigation from RealTimeJourneyPlanner application to Tiles Page
		 */
		onRealTimeJourneyPlannerNavBack: function() {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourney = {
					"TransId": "",
					"SFrom": "",
					"STo": ""
				};
			
			oRealTimeJourneyPlannerModel.setProperty("/NewJourneyClientCopy", jQuery.extend(true, {}, oNewJourney));
			oRealTimeJourneyPlannerModel.setProperty("/NewJourneyServerCopy", jQuery.extend(true, {}, oNewJourney));
			oRealTimeJourneyPlannerModel.setProperty("/JourneyRoutes", []);
			oRealTimeJourneyPlannerModel.setProperty("/RefreshButtonVisiblity", false);
			
			this.onNavBack();
		},
		
		/**
		 * Formatter method to handle circle color
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    sbInterChangeStation      Inter Change Station
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
				
			if((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) && 
				(sStationCriticality === "RED" || sStationCriticality === "Red")) {
				return true;
			} 
			
			return false;
		},
		
		/**
		 * Formatter method to handle circle color
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    sbInterChangeStation      Inter Change Station
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
				
			if((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) && 
				(sStationCriticality === "GREEN" || sStationCriticality === "Green")) {
				return true;
			} 
			
			return false;
		},
		
		/**
		 * Formatter method to handle circle color
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    sbInterChangeStation      Inter Change Station
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
				
			if((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) && 
				(sStationCriticality === "YELLOW" || sStationCriticality === "Yellow")) {
				return true;
			} 
			
			return false;
		},
		
		/**
		 * Formatter method to handle circle color
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    sbInterChangeStation      Inter Change Station
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
				
			if(sStationName !== sFromStation && sStationName !== sToStation && !bInterChangeStation) {
				return true;
			} 
			
			return false;
		},
		
		/**
		 * Formatter method to handle visiblity of Red Icon circle 
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    sbInterChangeStation      Inter Change Station
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
				
			if((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) && 
				(sStationCriticality === "RED" || sStationCriticality === "Red")) {
				return true;
			} 
			
			return false;
		},
		
		/**
		 * Formatter method to handle visiblity of Green Icon circle 
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    sbInterChangeStation      Inter Change Station
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
				
			if((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) && 
				(sStationCriticality === "GREEN" || sStationCriticality === "Green")) {
				return true;
			} 
			
			return false;
		},
		
		/**
		 * Formatter method to handle visiblity of Yellow Icon circle 
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    sbInterChangeStation      Inter Change Station
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
				
			if((sStationName === sFromStation || sStationName === sToStation || bInterChangeStation) && 
				(sStationCriticality === "YELLOW" || sStationCriticality === "Yellow")) {
				return true;
			} 
			
			return false;
		},
		
		/**
		 * Formatter method to handle visiblity of Normal Icon circle 
		 * @param   {string}     sStationName              Station Name
		 * @param   {boolean}    sbInterChangeStation      Inter Change Station
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
				
			if(!bInterChangeStation && sStationName !== sFromStation && sStationName !== sToStation) {
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
				
			if((sStationName !== sToStation) && (sMetroLineColor === "RED" || sMetroLineColor === "Red")) {
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
				
			if((sStationName !== sToStation) && (sMetroLineColor === "BLUE" || sMetroLineColor === "Blue")) {
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
				
			if((sStationName !== sToStation) && (sMetroLineColor === "GREEN" || sMetroLineColor === "Green")) {
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
				
			if((sStationName !== sToStation) && (sMetroLineColor === "VIOLET" || sMetroLineColor === "Violet")) {
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
				
			if((sStationName !== sToStation) && (sMetroLineColor === "ORANGE" || sMetroLineColor === "Orange")) {
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
				
			if((sStationName !== sToStation) && (sMetroLineColor === "PINK" || sMetroLineColor === "Pink")) {
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
				
			if((sStationName !== sToStation) && (sMetroLineColor === "YELLOW" || sMetroLineColor === "Yellow")) {
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
				
			if(sStationName === sFromStation) {
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
				
			if(sStationName === sToStation) {
				return true;
			} 
			
			return false;
		},
		
		/**
		 * Formatter method to handle visiblity of Icon Bottom Text
		 * @param   {string}     sStationName              Station Name
		 * @param   {string}     bInterChangeStation       Inter Change Station
		 * @public
		 * @returns {boolean}    sVisiblity                Visiblity of Icon Bottom Text
		 */
		formatIconBottomNormalText: function(sStationName, bInterChangeStation) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sFromStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/SFrom");
			var sToStation = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy/STo");
				
			if(sStationName !== sFromStation && sStationName !== sToStation && !bInterChangeStation) {
				return true;
			} 
			
			return false;
		},
		
		/**
		 * Called when From Station DropDown selection value is changed 
		 * @param {object} oEvent DropDown selection change event 
		 * @public
		 */
		onFromStationSelectionChange: function(oEvent) {
			this.validateStationDropDowns("DropDown1");
		},
		
		/**
		 * Called when To Station DropDown selection value is changed 
		 * @param {object} oEvent DropDown selection change event 
		 * @public
		 */
		onToStationSelectionChange: function(oEvent) {
			this.validateStationDropDowns("DropDown2");
		},
		
		/**
		 * Called when Submit button is pressed
		 * @param {object} oEvent DropDown selection change event 
		 * @public
		 */
		onPressSubmitButton: function(oEvent) {
			this.validateStationDropDowns("Both");
			
			if(this.checkStationsValidity()) {
				if (this.intervalHandle) {
					clearInterval(this.intervalHandle);
			    }
				this.getJourneyRoutesData();
			}
		},
		
		/**
		 * Function to get Journey Routes 
		 * @public
		 */
		getJourneyRoutesData: function() {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourney = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty("/NewJourneyClientCopy"));
			var oFilter;
			var aFilters = [];
			
			aFilters.push(new Filter("SFrom", FilterOperator.EQ, oNewJourney.SFrom));
			aFilters.push(new Filter("STo", FilterOperator.EQ, oNewJourney.STo));
			oFilter = [new Filter(aFilters, true)];
			
			this.getOwnerComponent().getModel().read("/NRouteReqSet", {
				success: function(oData) {
					
					var aJourneyRoutes = Utility.sanitizeEntitySetResult(oData, false);
					this.modifyJourneyRoutesData(aJourneyRoutes);
					this.updateMetroRoute();
					
					var aModifiedJourneyRoutes = jQuery.extend(true, [], oRealTimeJourneyPlannerModel.getProperty("/JourneyRoutes"));
					if(aModifiedJourneyRoutes.length > 0) {
						this.getView().byId("idRealTimeJourneyPlannerIconTabBar").setSelectedKey(aModifiedJourneyRoutes[0].RouteId);
					}
					
					oRealTimeJourneyPlannerModel.setProperty("/RefreshButtonVisiblity", true);
					this.refreshRealTimeJourneyData();
					
				}.bind(this),
				error: function(oError) {
					this._oErrorHandler._showServiceError(oError);
				}.bind(this),
				filters: oFilter
			});
		},
		
		/**
		 * Function to refresh journey data
		 * @public
		 */
		onPressRefreshButton: function() {
			if (this.intervalHandle) {
				clearInterval(this.intervalHandle);
		    }
			this.refreshJourneyRoutesData();
		},
		
		/**
		 * Function to validate stations dropdowns
		 * @param {string} sValidate Validate DropDowns 
		 * @public
		 */
		validateStationDropDowns: function(sValidate) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourney = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyClientCopy");
			var oFromStationControl = this.getView().byId("idFromStationDropDown");
			var oToStationControl = this.getView().byId("idToStationDropDown");
			
			oRealTimeJourneyPlannerModel.setProperty("/RefreshButtonVisiblity", false);
			
			if(sValidate === "Both" || sValidate === "DropDown1") {
				if(oNewJourney.SFrom === "") {
					oFromStationControl.setValueState("Error");
					oFromStationControl.setValueStateText("Select valid From Station");
					oToStationControl.getBinding("items").filter();
				} else {
					oFromStationControl.setValueState("None");
					oToStationControl.getBinding("items").filter(
						new Filter("Station_Name", FilterOperator.NE, oNewJourney.SFrom));
				}
			}
			
			if(sValidate === "Both" || sValidate === "DropDown2") {
				if(oNewJourney.STo === "") {
					oToStationControl.setValueState("Error");
					oToStationControl.setValueStateText("Select valid To Station");
					oFromStationControl.getBinding("items").filter();
				} else {
					oToStationControl.setValueState("None");
					oFromStationControl.getBinding("items").filter(
						new Filter("Station_Name", FilterOperator.NE, oNewJourney.STo));
				}
			}
			
			this.getView().getModel("RealTimeJourneyPlanner").setProperty("/NewJourneyClientCopy", 
				jQuery.extend(true, {}, oNewJourney));
		},
		
		/**
		 * Function to check wether From Station and To Station both are having valid values or not
		 * @public
		 * @returns {boolean} bStationsValidity  Returns true if From Station and To Station both are having valid values else false
		 */
		checkStationsValidity: function() {
			var oFromStationControl = this.getView().byId("idFromStationDropDown");
			var oToStationControl = this.getView().byId("idToStationDropDown");
			var bStationsValidity = false;
			
			if(oFromStationControl.getValueState() !== "Error" && oToStationControl.getValueState() !== "Error") {
				bStationsValidity = true;
			}
			
			return bStationsValidity;
		},
		
		/**
		 * Function to modify Journey data as per requirements
		 * @param {array} aJourneyRoutes    Array of possible journey routes
		 * @public
		 */
		modifyJourneyRoutesData: function(aJourneyRoutes) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oJourneyRouteEmptyStructure;
			var oStationEmptyStructure;
			var oNewJourneyServerCopy;
			var iNormalFare;
			var aVariableStations = [];
			var aStationCriticality = [];
			var aStations;
			var aMetroLines = [];
			var aMetroStations = [];
			var aModifiedJourneyRoutes = [];
			var aVarStationCriticalityMap = [];
			var oVarStationCriticalityMap = {};
			var iMatchingIndex;
			
			if(aJourneyRoutes.length > 0) {
				oNewJourneyServerCopy = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty(
					"/NewJourneyClientCopy"));
					
				oNewJourneyServerCopy.TransId = aJourneyRoutes[0].TransId;
				
				oRealTimeJourneyPlannerModel.setProperty("/NewJourneyServerCopy", jQuery.extend(true, {}, oNewJourneyServerCopy));
			}
				
			for(var intI = 0; intI < aJourneyRoutes.length; intI++) {
				oJourneyRouteEmptyStructure = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty(
					"/JourneyRouteEmptyStructure"));
					
				aVarStationCriticalityMap = [];
				aMetroStations = [];
				aMetroLines = [];
				aStations = [];
				aStationCriticality = [];
				aVariableStations = [];
				
				oJourneyRouteEmptyStructure.Route = (Number(aJourneyRoutes[intI].OptionId) === 1) ? 
					"Preferred Route" : "Optional Route " + aJourneyRoutes[intI].OptionId;
				oJourneyRouteEmptyStructure.RouteId = "IconTabItem" + aJourneyRoutes[intI].OptionId;
				
				oJourneyRouteEmptyStructure.JourneyTime = Number(aJourneyRoutes[intI].Total) + " Min";
				oJourneyRouteEmptyStructure.NormalFare = "₹ " + Number(aJourneyRoutes[intI].Fare);
				
				iNormalFare = Number(aJourneyRoutes[intI].Fare);
				oJourneyRouteEmptyStructure.ConcessionalFare = "₹ " + String(iNormalFare - Math.round((iNormalFare * 10) / 100));
				
				aVariableStations = aJourneyRoutes[intI].VariableStation.split("->");
			    aStationCriticality = aJourneyRoutes[intI].Criticality.split("->");
			    aMetroStations = aJourneyRoutes[intI].StationName.split("->");
			    aMetroLines = aJourneyRoutes[intI].LineColour.split("->");
			    
			    for(var intJ = 0; intJ < aVariableStations.length; intJ++) {
			    	oVarStationCriticalityMap = {};
			    	
			    	oVarStationCriticalityMap.StationName = aVariableStations[intJ];
			    	oVarStationCriticalityMap.Criticality = aStationCriticality[intJ];
			    	
			    	switch (intJ) {
						case 0:
							oVarStationCriticalityMap.Station = "From Station";
							break;
						case 1:
							oVarStationCriticalityMap.Station = "To Station";
							break;
						default:
							oVarStationCriticalityMap.Station = "InterChange Station " + (intJ - 1);
					}
			    	
			    	aVarStationCriticalityMap.push(oVarStationCriticalityMap);
			    }
			    
			    aVarStationCriticalityMap.splice((aVarStationCriticalityMap.length - 1), 0, aVarStationCriticalityMap.splice(1, 1)[0]);
			    
			    aVariableStations.splice(0, 2);
				
				oJourneyRouteEmptyStructure.NoOfStations = aMetroStations.length;
				oJourneyRouteEmptyStructure.NoOfInterChange = Number(aJourneyRoutes[intI].NoInterchange);
				
				for(var intK = 0; intK < aMetroStations.length; intK++) {
					oStationEmptyStructure = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty("/StationEmptyStructure"));
					
					oStationEmptyStructure.StationName = aMetroStations[intK]; 
					oStationEmptyStructure.MetroStationColor = aMetroLines[intK]; 
					oStationEmptyStructure.MetroLineColor = aMetroLines[intK + 1]; 
					oStationEmptyStructure.InterChangeStation = (aVariableStations.indexOf(aMetroStations[intK]) >= 0) ? true : false;  
					
					//TODO: needs to uncomment the below code
					
					// if(oStationEmptyStructure.InterChangeStation) {
					// 	oStationEmptyStructure.MetroStationColor = "";
					// }
					
					iMatchingIndex = -1;
					
					iMatchingIndex = Utility.findWithAttr(aVarStationCriticalityMap, "StationName", aMetroStations[intK]);
					if(iMatchingIndex >= 0) {
						oStationEmptyStructure.StationCriticality = aVarStationCriticalityMap[iMatchingIndex].Criticality;
					}
					
					aStations.push(oStationEmptyStructure);
				}
				
				oJourneyRouteEmptyStructure.Stations = aStations;
				oJourneyRouteEmptyStructure.VariableStations = aVarStationCriticalityMap;
				
				aModifiedJourneyRoutes.push(oJourneyRouteEmptyStructure);
			}
			
			oRealTimeJourneyPlannerModel.setProperty("/JourneyRoutes", jQuery.extend(true, [], aModifiedJourneyRoutes));
		},
		
		/**
		 * Function to refresh Journey data
		 * @public
		 */
		refreshRealTimeJourneyData: function() {
			var self = this;
				this.intervalHandle = setInterval(function() { 
				  self.refreshJourneyRoutesData();
			},  120000);
		},
		
		/**
		 * Function to get refreshed Journey Routes 
		 * @public
		 */
		refreshJourneyRoutesData: function() {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourney = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var oFilter;
			var aFilters = [];
			
			aFilters.push(new Filter("TransId", FilterOperator.EQ, oNewJourney.TransId));
			oFilter = [new Filter(aFilters, true)];
			
			this.getOwnerComponent().getModel().read("/NRouteReqSet", {
				success: function(oData) {
					var aJourneyRoutes = Utility.sanitizeEntitySetResult(oData, false);
					this.modifyJourneyRoutesData(aJourneyRoutes);
				}.bind(this),
				error: function(oError) {
					this._oErrorHandler._showServiceError(oError);
				}.bind(this),
				filters: oFilter
			});
		},
		
		/**
		 * Function to update Metro Route on Screen
		 * @public
		 */
		updateMetroRoute: function() {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourney = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var oRequest = {
				origin: oNewJourney.SFrom,
				destination: oNewJourney.STo,
				travelMode: "DRIVING"
			};
			
			this._oDirectionsService.route(oRequest, function(oResponse, sStatus) {
				if (sStatus === "OK") {
					this._oDirectionsRenderer.setDirections(oResponse);
				}
			});
		}
	});
});