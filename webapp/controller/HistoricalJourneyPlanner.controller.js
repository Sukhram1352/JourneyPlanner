sap.ui.define([
	"journeyPlanner/JourneyPlanner/controller/BaseController",
	"journeyPlanner/JourneyPlanner/model/formatter",
	"journeyPlanner/JourneyPlanner/model/HistoricalJourneyPlannerModel",
	"journeyPlanner/JourneyPlanner/util/Utility",
	"journeyPlanner/JourneyPlanner/controller/ErrorHandler",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, HistoricalJourneyPlannerModel, Utility, ErrorHandler, Filter, FilterOperator) {
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
			
			var oHistoricalJourneyPlannerModel = new HistoricalJourneyPlannerModel();
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
			
			var oRoute = this.getRouter();
			oRoute.attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		/**
		 * Function is Called When Route Pattern is matched
		 * @param {object} oEvent    Route Pattern Match Event
		 * @public
		 */
		_onRouteMatched:function(oEvent){
			var sStationName = oEvent.getParameter("arguments").StationName;
			var sDay = oEvent.getParameter("arguments").Day;
			
			if(sStationName !== "*") {
				this.getModel("HistoricalJourneyPlanner").setProperty("/NewStationClientCopy", {
					"Station": sStationName,
					"Day": sDay
				});
				
				this.onPressSubmitButton();
			}
		},
		
		/**
		 * Function is Called Station or Day DropDown selection value is changed 
		 * @param {object} oEvent         DropDown selection change event 
		 * @public
		 */
		onDropDownSelectionChange: function (oEvent) {
			this.validateDropDowns(oEvent.getSource().data("dropdown"));
		},
		
		/**
		 * Function is Called when Submit button is pressed
		 * @public
		 */
		onPressSubmitButton: function () {
			var oHistoricalJourneyPlannerModel = this.getView().getModel("HistoricalJourneyPlanner");
			
			this.validateDropDowns("Both");
			oHistoricalJourneyPlannerModel.setProperty("/EmptyVBoxVisiblity", this.emptyVBoxVisiblity());
			
			if (this.checkDropDownsValidity()) {
				this.getView().getModel("HistoricalJourneyPlanner").setProperty("/FullScreenPageBusy", true);
				this.getStationCrowdData();
			}
		},
		
		/**
		 * Function to validate Station and Day dropdowns
		 * @param {string} sValidate    Validate DropDowns 
		 * @public
		 */
		validateDropDowns: function (sValidate) {
			var oHistoricalJourneyPlannerModel = this.getView().getModel("HistoricalJourneyPlanner");
			var oNewStation = oHistoricalJourneyPlannerModel.getProperty("/NewStationClientCopy");
			var oStationControl = this.getView().byId("idStationDropDown");
			var oDayControl = this.getView().byId("idDayDropDown");

			if (sValidate === "Both" || sValidate === "Station") {
				if (oNewStation.Station === "") {
					oStationControl.setValueState("Error");
					oStationControl.setValueStateText("Select valid Station");
				} else {
					oStationControl.setValueState("None");
				}
			}

			if (sValidate === "Both" || sValidate === "Day") {
				if (oNewStation.Day === "") {
					oDayControl.setValueState("Error");
					oDayControl.setValueStateText("Select valid Day");
				} else {
					oDayControl.setValueState("None");
				}
			}
		},
		
		/**
		 * Function to check wether Empty VBox should be visible or not
		 * @public
		 * @returns {boolean} bEmptyVBoxVisiblity  Returns true if Empty VBox should be visible else false
		 */
		emptyVBoxVisiblity: function() {
			var oNewStation = jQuery.extend(true, {}, this.getModel("HistoricalJourneyPlanner").getProperty("/NewStationClientCopy"));
			var oStationControl = this.getView().byId("idStationDropDown");
			var oDayControl = this.getView().byId("idDayDropDown");
			var bEmptyVBoxVisiblity = true;

			if (oStationControl.getValueState() !== "Error" && oNewStation.Station !== "" && oDayControl.getValueState() !== "Error" && oNewStation.Day !== "") {
				bEmptyVBoxVisiblity = false;
			}

			return bEmptyVBoxVisiblity;
		},
		
		/**
		 * Function to check wether Station and Day both are having valid values or not
		 * @public
		 * @returns {boolean} bStationsValidity  Returns true if Station and Day both are having valid values else false
		 */
		checkDropDownsValidity: function () {
			var oStationControl = this.getView().byId("idStationDropDown");
			var oDayControl = this.getView().byId("idDayDropDown");
			var bStationsValidity = false;

			if (oStationControl.getValueState() !== "Error" && oDayControl.getValueState() !== "Error") {
				bStationsValidity = true;
			}

			return bStationsValidity;
		},
		
		/**
		 * Function is called on Back Navigation from HistoricalJourneyPlanner application to Tiles Page
		 * @public
		 */
		onHistoricalJourneyPlannerNavBack: function () {
			var oHistoricalJourneyPlannerModel = this.getView().getModel("HistoricalJourneyPlanner");
			var oNewStation = {
				"Station": "",
				"Day": ""
			};
			
			oHistoricalJourneyPlannerModel.setProperty("/NewStationClientCopy", jQuery.extend(true, {}, oNewStation));
			oHistoricalJourneyPlannerModel.setProperty("/FullScreenPageBusy", false);
			oHistoricalJourneyPlannerModel.setProperty("/EmptyVBoxVisiblity", true);
			oHistoricalJourneyPlannerModel.setProperty("/CrowdData", []);
			
			this.onNavBack();
		},
		
		/**
		 * Function is called to get Crowd data for a Particular Station
		 * @public
		 */
		getStationCrowdData: function() {
			var oHistoricalJourneyPlannerModel = this.getView().getModel("HistoricalJourneyPlanner");
			var oNewJourney = jQuery.extend(true, {}, oHistoricalJourneyPlannerModel.getProperty("/NewStationClientCopy"));
			var oFilter;
			var aFilters = [];
			
			aFilters.push(new Filter("station_name", FilterOperator.EQ, oNewJourney.Station));
		    aFilters.push(new Filter("week_day", FilterOperator.EQ, oNewJourney.Day));
			oFilter = [new Filter(aFilters, true)];
			
			this.getOwnerComponent().getModel().read("/zstation_historic", {
				success: function (oData) {
					
					var aCrowdData = oData.results;
					var oHistoricalJourneyPlannerModel = this.getView().getModel("HistoricalJourneyPlanner");
					Utility.sanitizeEntitySetResult(aCrowdData, false);
					
					for(var intI = 0; intI < aCrowdData.length; intI++) {
						aCrowdData[intI].capacity = Math.round(Number(aCrowdData[intI].capacity));
						aCrowdData[intI].crowd1 = Math.round(Number(aCrowdData[intI].crowd1));
					}
					oHistoricalJourneyPlannerModel.setProperty("/CrowdData", oData.results);
					oHistoricalJourneyPlannerModel.setProperty("/FullScreenPageBusy", false);
					
					if(aCrowdData.length > 0) {
						var oPopOver = this.getView().byId("idPopOver");
                        oPopOver.connect(this.getView().byId("idCrowdVizFrame").getVizUid());
						this.getView().byId("idCrowdVizFrame").setVizProperties({
							title: {
								visible: true,
								text: aCrowdData[0].station_name
							}
						});
					}
					
				}.bind(this),
				error: function (oError) {
					this._oErrorHandler(oError);
				}.bind(this),
				filters: oFilter
			});
		}
	});
});