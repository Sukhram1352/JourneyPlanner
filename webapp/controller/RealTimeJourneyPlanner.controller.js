sap.ui.define([
	"journeyPlanner/JourneyPlanner/controller/BaseController",
	"journeyPlanner/JourneyPlanner/controller/RealTimeJourneyPlannerFormatter",
	"journeyPlanner/JourneyPlanner/model/formatter",
	"journeyPlanner/JourneyPlanner/model/RealTimeJourneyPlannerModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"journeyPlanner/JourneyPlanner/controller/ErrorHandler",
	"journeyPlanner/JourneyPlanner/util/Utility"
], function (BaseController, RealTimeJourneyPlannerFormatter, formatter, RealTimeJourneyPlannerModel, 
			 Filter, FilterOperator, ErrorHandler, Utility) {
	"use strict";

	return BaseController.extend("journeyPlanner.JourneyPlanner.controller.RealTimeJourneyPlanner", 
	
		// extend controller with helpers
		jQuery.extend(true, {}, RealTimeJourneyPlannerFormatter, {

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
			
			// Global variables for Map
			this._oPolyLine = [];
			this._oStartMarker = null;
			this._oEndMarker = null;

			var oRealTimeJourneyPlannerModel = new RealTimeJourneyPlannerModel();
			this.getView().setModel(oRealTimeJourneyPlannerModel, "RealTimeJourneyPlanner");

			this.getOwnerComponent().getModel().read("/StationNameSet", {
				success: function (oData) {
					var aMetroStstions = Utility.sanitizeEntitySetResult(oData, false);
					this.getView().getModel("RealTimeJourneyPlanner").setProperty("/MetroStations",
						jQuery.extend(true, [], aMetroStstions));
				}.bind(this),
				error: function (oError) {
					this._oErrorHandler(oError);
				}.bind(this)
			});
		},

		/**
		 * Called when the RealTimeJourneyPlanner controller is terminated.
		 * @public
		 */
		onExit: function () {
			if (this.intervalHandle) {
				clearInterval(this.intervalHandle);
			}
		},

		/**
		 * Called when the RealTimeJourneyPlanner controller is rendered.
		 * @public
		 */
		onAfterRendering: function () {
			var myOptions = {
				zoom: 12,
				center: new google.maps.LatLng(28.657924, 77.215569),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			this.map = new google.maps.Map(this.getView().byId("idGoogleMapTrial").getDomRef(), myOptions);
			this._oDirectionsRenderer = new google.maps.DirectionsRenderer({
				map: this.map,
				polylineOptions: {
					strokeColor: "red"
				}
			});
					
			this._oDirectionsService = new google.maps.DirectionsService;
			this._oDirectionsRenderer.setMap(this.map);

			// get the bounds of the polyline
			google.maps.Polyline.prototype.getBounds = function (startBounds) {
				if (startBounds) {
					var bounds = startBounds;
				} else {
					var bounds = new google.maps.LatLngBounds();
				}

				this.getPath().forEach(function (item, index) {
					bounds.extend(new google.maps.LatLng(item.lat(), item.lng()));
				});
				return bounds;
			};
		},

		/**
		 * Function is called on Back Navigation from RealTimeJourneyPlanner application to Tiles Page
		 * @public
		 */
		onRealTimeJourneyPlannerNavBack: function () {
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
			
			if (this.intervalHandle) {
				clearInterval(this.intervalHandle);
			}
			
			this.removeAlreadyDrawnedPolylines();
			
			this.onNavBack();
		},
		
		onStationNameSelect: function(oEvent){
			debugger
			var sStationName = oEvent.getSource().getProperty("text");
			
			this.getRouter().navTo("historicalJourneyPlanner", {
				StationName: sStationName
			});
		},
		
		/**
		 * Called when From Station DropDown selection value is changed 
		 * @param {object} oEvent DropDown selection change event 
		 * @public
		 */
		onFromStationSelectionChange: function (oEvent) {
			this.validateStationDropDowns("DropDown1");
		},

		/**
		 * Called when To Station DropDown selection value is changed 
		 * @param {object} oEvent DropDown selection change event 
		 * @public
		 */
		onToStationSelectionChange: function (oEvent) {
			this.validateStationDropDowns("DropDown2");
		},
		
		/**
		 * Function is Called when Submit button is pressed
		 * @param {object} oEvent DropDown selection change event 
		 * @public
		 */
		onPressSubmitButton: function (oEvent) {
			this.validateStationDropDowns("Both");
			
			if (this.checkStationsValidity()) {
				this.getView().getModel("RealTimeJourneyPlanner").setProperty("/FullScreenPageBusy", true);
				if (this.intervalHandle) {
					clearInterval(this.intervalHandle);
				}
				this.getJourneyRoutesData();
			}
		},
		
		/**
		 * Function is Called when Icon Tab Bar selection is changed
		 * @param {object} oEvent DropDown selection change event 
		 * @public
		 */
		onChangeJourneyRouteTab: function() {
			this.updateMetroRoute();
		},
		
		/**
		 * Function to get Journey Routes 
		 * @public
		 */
		getJourneyRoutesData: function () {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourney = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty("/NewJourneyClientCopy"));
			var oFilter;
			var aFilters = [];
			
			aFilters.push(new Filter("SFrom", FilterOperator.EQ, oNewJourney.SFrom));
			aFilters.push(new Filter("STo", FilterOperator.EQ, oNewJourney.STo));
			oFilter = [new Filter(aFilters, true)];

			this.getOwnerComponent().getModel().read("/NRouteReqSet", {
				success: function (oData) {

					var aJourneyRoutes = Utility.sanitizeEntitySetResult(oData, false);
					this.modifyJourneyRoutesData(aJourneyRoutes);
					this.updateMetroRoute();

					var aModifiedJourneyRoutes = jQuery.extend(true, [], oRealTimeJourneyPlannerModel.getProperty("/JourneyRoutes"));
					if (aModifiedJourneyRoutes.length > 0) {
						this.getView().byId("idRealTimeJourneyPlannerIconTabBar").setSelectedKey(aModifiedJourneyRoutes[0].RouteId);
					}

					oRealTimeJourneyPlannerModel.setProperty("/RefreshButtonVisiblity", true);
					this.refreshRealTimeJourneyData();

				}.bind(this),
				error: function (oError) {
					this._oErrorHandler._showServiceError(oError);
				}.bind(this),
				filters: oFilter
			});
		},

		/**
		 * Function to refresh journey data
		 * @public
		 */
		onPressRefreshButton: function () {
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
		validateStationDropDowns: function (sValidate) {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourney = oRealTimeJourneyPlannerModel.getProperty("/NewJourneyClientCopy");
			var oFromStationControl = this.getView().byId("idFromStationDropDown");
			var oToStationControl = this.getView().byId("idToStationDropDown");

			oRealTimeJourneyPlannerModel.setProperty("/RefreshButtonVisiblity", false);

			if (sValidate === "Both" || sValidate === "DropDown1") {
				if (oNewJourney.SFrom === "") {
					oFromStationControl.setValueState("Error");
					oFromStationControl.setValueStateText("Select valid From Station");
					oToStationControl.getBinding("items").filter();
				} else {
					oFromStationControl.setValueState("None");
					oToStationControl.getBinding("items").filter(
						new Filter("Station_Name", FilterOperator.NE, oNewJourney.SFrom));
				}
			}

			if (sValidate === "Both" || sValidate === "DropDown2") {
				if (oNewJourney.STo === "") {
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
		checkStationsValidity: function () {
			var oFromStationControl = this.getView().byId("idFromStationDropDown");
			var oToStationControl = this.getView().byId("idToStationDropDown");
			var bStationsValidity = false;

			if (oFromStationControl.getValueState() !== "Error" && oToStationControl.getValueState() !== "Error") {
				bStationsValidity = true;
			}

			return bStationsValidity;
		},

		/**
		 * Function to modify Journey data as per requirements
		 * @param {array} aJourneyRoutes    Array of possible journey routes
		 * @public
		 */
		modifyJourneyRoutesData: function (aJourneyRoutes) {
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

			if (aJourneyRoutes.length > 0) {
				oNewJourneyServerCopy = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty(
					"/NewJourneyClientCopy"));
					
				oNewJourneyServerCopy.TransId = aJourneyRoutes[0].TransId;
					
				oRealTimeJourneyPlannerModel.setProperty("/NewJourneyServerCopy", jQuery.extend(true, {}, oNewJourneyServerCopy));
			}
				
			for (var intI = 0; intI < aJourneyRoutes.length; intI++) {
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
					
				for (var intJ = 0; intJ < aVariableStations.length; intJ++) {
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
					
				for (var intK = 0; intK < aMetroStations.length; intK++) {
					oStationEmptyStructure = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty("/StationEmptyStructure"));
						
					oStationEmptyStructure.StationName = aMetroStations[intK];
					oStationEmptyStructure.MetroStationColor = aMetroLines[intK];
					oStationEmptyStructure.MetroLineColor = aMetroLines[intK + 1];
					oStationEmptyStructure.InterChangeStation = (aVariableStations.indexOf(aMetroStations[intK]) >= 0) ? true : false;
						
					iMatchingIndex = Utility.findWithAttr(aVarStationCriticalityMap, "StationName", aMetroStations[intK]);
					if (iMatchingIndex >= 0) {
						oStationEmptyStructure.StationCriticality = aVarStationCriticalityMap[iMatchingIndex].Criticality;
					}
						
					aStations.push(oStationEmptyStructure);
				}
					
				oJourneyRouteEmptyStructure.Stations = aStations;
				oJourneyRouteEmptyStructure.VariableStations = aVarStationCriticalityMap;
					
				aModifiedJourneyRoutes.push(oJourneyRouteEmptyStructure);
			}
				
			oRealTimeJourneyPlannerModel.setProperty("/JourneyRoutes", jQuery.extend(true, [], aModifiedJourneyRoutes));
			oRealTimeJourneyPlannerModel.setProperty("/FullScreenPageBusy", false);
		},

		/**
		 * Function to refresh Journey data
		 * @public
		 */
		refreshRealTimeJourneyData: function () {
			var self = this;
			this.intervalHandle = setInterval(function () {
				self.refreshJourneyRoutesData();
			}, 60000);
		},

		/**
		 * Function to get refreshed Journey Routes 
		 * @public
		 */
		refreshJourneyRoutesData: function () {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var oNewJourney = jQuery.extend(true, {}, oRealTimeJourneyPlannerModel.getProperty("/NewJourneyServerCopy"));
			var oFilter;
			var aFilters = [];

			aFilters.push(new Filter("TransId", FilterOperator.EQ, oNewJourney.TransId));
			oFilter = [new Filter(aFilters, true)];
			
			this.getView().getModel("RealTimeJourneyPlanner").setProperty("/FullScreenPageBusy", true);

			this.getOwnerComponent().getModel().read("/NRouteReqSet", {
				success: function (oData) {
					var aJourneyRoutes = Utility.sanitizeEntitySetResult(oData, false);
					this.modifyJourneyRoutesData(aJourneyRoutes);
				}.bind(this),
				error: function (oError) {
					this._oErrorHandler._showServiceError(oError);
				}.bind(this),
				filters: oFilter
			});
		},

		/**
		 * Function to update Metro Route on Screen
		 * @public
		 */
		updateMetroRoute: function () {
			var oRealTimeJourneyPlannerModel = this.getView().getModel("RealTimeJourneyPlanner");
			var sSelectedItemTabKey = this.getView().byId("idRealTimeJourneyPlannerIconTabBar").getSelectedKey();
			var sRouteId = (sSelectedItemTabKey === "") ? "IconTabItem1" : sSelectedItemTabKey;
			var aStations = jQuery.extend(true, [], 
						oRealTimeJourneyPlannerModel.getProperty("/JourneyRoutes/" + (Number(sRouteId.split("IconTabItem")[1]) - 1) + "/Stations"));
			var aVariableRouteStations = jQuery.extend(true, [], 
						oRealTimeJourneyPlannerModel.getProperty("/JourneyRoutes/" + (Number(sRouteId.split("IconTabItem")[1]) - 1) + "/VariableStations"));
			var aStationMapRelatedData = jQuery.extend(true, [], oRealTimeJourneyPlannerModel.getProperty("/StationMapRelatedData"));
			var oRequiredStationData = {};
			var aRequiredStationData = [];
			
			this.removeAlreadyDrawnedPolylines();
			
			for(var intI = 0; intI < aStations.length; intI++) {
				if(Utility.findWithAttr(aVariableRouteStations, "StationName", aStations[intI].StationName) >= 0) {
					oRequiredStationData = aStationMapRelatedData[Utility.findWithAttr(aStationMapRelatedData, "StationName", aStations[intI].StationName)];
					oRequiredStationData.color = aStations[intI].MetroLineColor;
					aRequiredStationData.push(aStationMapRelatedData[Utility.findWithAttr(aStationMapRelatedData, "StationName", aStations[intI].StationName)]);
					oRequiredStationData= {};
				}
			}
			
			this.drawMetroLineInGoogleMap(aRequiredStationData);
		},
		
		/**
		 * Function to remove already drawned polylines and markers
		 * @public
		 */
		removeAlreadyDrawnedPolylines: function() {
			// Remove already drawned polylines on Google Map
			for(var intJ = 0; intJ < this._oPolyLine.length; intJ++) {
				this._oPolyLine[intJ].setMap(null);
			}
			
			// Remove Start Marker which is drawned earlier
			if(this._oStartMarker) {
				this._oStartMarker.setMap(null);
			}
			
			// Remove End Marker which is drawned earlier
			if(this._oEndMarker) {
				this._oEndMarker.setMap(null);
			}
		},
		
		/**
		 * Function to draw polyline and markers in google map as per current route
		 * @public
		 */
		drawMetroLineInGoogleMap: function(aRequiredStationData) {
			var oNewJourneyClientCopy = this.getView().getModel("RealTimeJourneyPlanner").getProperty("/NewJourneyClientCopy");
			var polylines = [];
			var oMapDeferredObject = jQuery.Deferred();
			var aStationLatLongData = [];
			var oStationLatLongData = {};
			
			for(var intI = 0; intI < (aRequiredStationData.length - 1); intI++) {
				oStationLatLongData.startlatitude = aRequiredStationData[intI].Latitude;
				oStationLatLongData.startlongitude = aRequiredStationData[intI].Longitude;
				oStationLatLongData.endlatitude = aRequiredStationData[intI + 1].Latitude;
				oStationLatLongData.endlongitude = aRequiredStationData[intI + 1].Longitude;
				oStationLatLongData.color = aRequiredStationData[intI].color.toLowerCase();
				
				aStationLatLongData.push(oStationLatLongData);
				
				if(intI === 0) {
					this._oStartMarker = new google.maps.Marker({
						position: {
							lat: oStationLatLongData.startlatitude,
							lng: oStationLatLongData.startlongitude
						},
						map: this.map,
						title: oNewJourneyClientCopy.SFrom
					});
				}
				
				if(intI === (aRequiredStationData.length - 2)) {
					this._oEndMarker = new google.maps.Marker({
						position: {
							lat: oStationLatLongData.endlatitude,
							lng: oStationLatLongData.endlongitude
						},
						map: this.map,
						title: oNewJourneyClientCopy.STo
					});
				}
				
				oStationLatLongData = {};
			}

			var aBounds = new google.maps.LatLngBounds();
			
			aStationLatLongData.forEach(function (oStationLatLong, iIndex) {
				var oRequest = {
					origin: new google.maps.LatLng(oStationLatLong.startlatitude, oStationLatLong.startlongitude), 
					destination: new google.maps.LatLng(oStationLatLong.endlatitude, oStationLatLong.endlongitude), 
					provideRouteAlternatives: true,
					travelMode: "TRANSIT",
					transitOptions: {
						modes: ["RAIL"]
					}
				};

				this._oDirectionsService.route(oRequest, function (oResponse, sStatus) {
					if (sStatus === "OK") {
						var line = this.drawPolyline(oResponse.routes[0].overview_path, oStationLatLong.color);
						polylines.push(line);
						aBounds = line.getBounds();
						
						this._oPolyLine.push(line);
						
						if (iIndex === aStationLatLongData.length - 1) {
							oMapDeferredObject.resolve();
						}
					}
				}.bind(this));
			}.bind(this));

			oMapDeferredObject.done(function () {
				this.map.fitBounds(aBounds);
			}.bind(this));
		},
		
		/**
		 * Function to draw polyline in google map as per current route
		 * @public
		 */
		drawPolyline: function (path, color) {
			var line = new google.maps.Polyline({
				path: path,
				strokeColor: color,
				strokeOpacity: 0.7,
				strokeWeight: 6
			});
			
			line.setMap(this.map);
			return line;
		}
	}));
});