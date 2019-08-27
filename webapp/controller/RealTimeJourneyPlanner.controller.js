sap.ui.define([
	"journeyPlanner/JourneyPlanner/controller/BaseController",
	"journeyPlanner/JourneyPlanner/model/formatter",
	"journeyPlanner/JourneyPlanner/model/RealTimeJourneyPlannerModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, RealTimeJourneyPlannerModel, Filter, FilterOperator) {
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
			var oRealTimeJourneyPlannerModel = new RealTimeJourneyPlannerModel();
			this.getView().setModel(oRealTimeJourneyPlannerModel, "RealTimeJourneyPlanner");
		},
		
		onAfterRendering: function() {
			// this.geocoder = new google.maps.Geocoder();
			// window.mapOptions = {                          
			// 	center: new google.maps.LatLng(28.644800, 	77.216721),
			// 	zoom: 13,
			// 	mapTypeId: google.maps.MapTypeId.ROADMAP
			// }; 
			
			// var map = new google.maps.Map(this.getView().byId("idGoogleMapTrial").getDomRef(), mapOptions);
			// var infowindow = new google.maps.InfoWindow;
			// var geocoder = new google.maps.Geocoder();
			// var marker = new google.maps.Marker({
			// 	map: map,
			// });
			
		var myOptions = {zoom:12,
		                 center:new google.maps.LatLng(20,77),
		                 mapTypeId: google.maps.MapTypeId.ROADMAP
		                 };
		var map = new google.maps.Map(this.getView().byId("idGoogleMapTrial").getDomRef(), myOptions);
		var marker = new google.maps.Marker({map: map,
				position: new google.maps.LatLng(20,77)
			});
		var infowindow = new google.maps.InfoWindow({content:'<strong></strong><br>SAP Labs India, Vatika tower, Tower A, 4th floor,, Golf Course Road, Sector-54,<br>122002 GURUGRAM<br>'});
		infowindow.open(map,marker);
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
		},
		
		/**
		 * Function to validate stations dropdowns
		 * @param {string} sValidate Validate DropDowns 
		 * @public
		 */
		validateStationDropDowns: function(sValidate) {
			var oNewJourney = this.getView().getModel("RealTimeJourneyPlanner").getProperty("/NewJourney");
			var oFromStationControl = this.getView().byId("idFromStationDropDown");
			var oToStationControl = this.getView().byId("idToStationDropDown");
			
			if(sValidate === "Both" || sValidate === "DropDown1") {
				if(oNewJourney.FromStation === "") {
					oFromStationControl.setValueState("Error");
					oFromStationControl.setValueStateText("Select valid From Station");
					oToStationControl.getBinding("items").filter();
				} else {
					oFromStationControl.setValueState("None");
					oToStationControl.getBinding("items").filter(
						new Filter("StationName", FilterOperator.NE, oNewJourney.FromStation));
				}
			}
			
			if(sValidate === "Both" || sValidate === "DropDown2") {
				if(oNewJourney.ToStation === "") {
					oToStationControl.setValueState("Error");
					oToStationControl.setValueStateText("Select valid To Station");
					oFromStationControl.getBinding("items").filter();
				} else {
					oToStationControl.setValueState("None");
					oFromStationControl.getBinding("items").filter(
						new Filter("StationName", FilterOperator.NE, oNewJourney.ToStation));
				}
			}
			
			this.getView().getModel("RealTimeJourneyPlanner").setProperty("/NewJourney", 
				jQuery.extend(true, {}, oNewJourney));
		}
	});
});