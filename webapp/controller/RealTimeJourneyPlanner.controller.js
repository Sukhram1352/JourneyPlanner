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
			
			this.getView().byId("map_canvas").addStyleClass("myMap");
			
			window.addEventListener('load', function() { 
				var script = document.createElement('script'); 
				script.type = 'text/javascript'; 
				script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&avoid=TOLLS&libraries=places&callback=initMap'; 
				document.body.appendChild(script); 
				
			}); 
			
			function initMap() { 
				var directionsRenderer = new google.maps.DirectionsRenderer({ map: map }); 
				var directionsService = new google.maps.DirectionsService; 
				var map = new google.maps.Map(document.getElementById('map'), { 
					zoom: 6, 
					center: { 
						lat: 23.0225, 
						lng: 72.5714 
					} 
				}); 
				
			    directionsRenderer.setMap(map); 
			    directionsRenderer.setPanel(document.getElementById('left-div')); 
			    
			    var control = document.getElementById('front-div'); 
			    control.style.display = 'inline'; 
			    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control); 
			    
			    document.getElementById('origin').addEventListener('change', function() { 
			    	distanceCalculator(directionsService, directionsRenderer); 
			    }, false); 
			    
			    document.getElementById('destination').addEventListener('click', function() { 
			    	distanceCalculator(directionsService, directionsRenderer); 
			    }, false); } 
			    
			    function distanceCalculator(directionsService, directionsRenderer) { 
			    	var origin = document.getElementById('origin').value; 
			    	var destination = document.getElementById('destination').value; 
			    	var req = { origin: origin, destination: destination, travelMode: 'DRIVING' }; 
			    	directionsService.route(req, function(response, status) { 
			    		if (status === 'OK') { 
			    			directionsRenderer.setDirections(response); 
			    		} 
			    	}); 
			    }
		},
		
		onAfterRendering: function() {
			// if (!this.initialized) {
			// 	this.initialized = true;
			// 	this.geocoder = new google.maps.Geocoder();
			// 	window.mapOptions = {                          
			// 		center: new google.maps.LatLng(-34.397, 150.644),
			// 		zoom: 8,
			// 		mapTypeId: google.maps.MapTypeId.ROADMAP
			// 	}; 
				
			// 	var map = new google.maps.Map(this.getView().byId("map_canvas").getDomRef(), mapOptions);
			// 	var infowindow = new google.maps.InfoWindow;
			// 	var geocoder = new google.maps.Geocoder();
			// 	var marker = new google.maps.Marker({
			// 		map: map,
			// 	});
			// }
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