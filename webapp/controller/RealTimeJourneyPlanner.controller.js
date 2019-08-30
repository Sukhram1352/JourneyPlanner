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
		 * Called when the RealTimeJourneyPlanner controller is rendered.
		 * @public
		 */
		onAfterRendering: function() {
			var myOptions = {zoom:12,
			                 center:new google.maps.LatLng(20,77),
			                 mapTypeId: google.maps.MapTypeId.ROADMAP
			                 };
			var map = new google.maps.Map(this.getView().byId("idGoogleMapTrial").getDomRef(), myOptions);
			var marker = new google.maps.Marker({map: map,
					position: new google.maps.LatLng(20,77)
				});
			// var infowindow = new google.maps.InfoWindow({content:'<strong></strong><br>SAP Labs India, Vatika tower, Tower A, 4th floor,, Golf Course Road, Sector-54,<br>122002 GURUGRAM<br>'});
			// infowindow.open(map,marker);
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
					}.bind(this),
					error: function(oError) {
						this._oErrorHandler._showServiceError(oError);
					}.bind(this),
					filters: oFilter
				});
			}
		},
		
		/**
		 * Function to validate stations dropdowns
		 * @param {string} sValidate Validate DropDowns 
		 * @public
		 */
		validateStationDropDowns: function(sValidate) {
			var oNewJourney = this.getView().getModel("RealTimeJourneyPlanner").getProperty("/NewJourneyClientCopy");
			var oFromStationControl = this.getView().byId("idFromStationDropDown");
			var oToStationControl = this.getView().byId("idToStationDropDown");
			
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
					"/NewJourneyServerCopy"));
					
				oNewJourneyServerCopy.TransId = aJourneyRoutes[0].TransId;
				oNewJourneyServerCopy.SFrom = aJourneyRoutes[0].SFrom;
				oNewJourneyServerCopy.STo = aJourneyRoutes[0].STo;
				
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
				
				// oJourneyRouteEmptyStructure.Route = (Number(aJourneyRoutes[intI].OptionId) === 1) ? 
				// 	"Preferred Route" : "Optional Route " + aJourneyRoutes[intI].OptionId;
				// oJourneyRouteEmptyStructure.RouteId = "IconTabItem" + aJourneyRoutes[intI].OptionId;
				
				oJourneyRouteEmptyStructure.Route = (intI === 0) ? 
					"Preferred Route" : "Optional Route " + (intI + 1);
				oJourneyRouteEmptyStructure.RouteId = "IconTabItem" + (intI + 1);
				
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
					oStationEmptyStructure.MetroLine = aMetroLines[intK]; 
					oStationEmptyStructure.InterChangeStation = (aVariableStations.indexOf(aMetroStations[intK]) >= 0) ? true : false;  
					
					if(oStationEmptyStructure.InterChangeStation) {
						oStationEmptyStructure.MetroLine = "";
					}
					
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
		}
	});
});