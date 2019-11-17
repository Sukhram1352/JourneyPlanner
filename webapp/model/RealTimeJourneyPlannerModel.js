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
					"MetroStationColor": "",
					"MetroLineColor": "",
					"StationCriticality": ""
				},
				JourneyRoutes: [],
				RefreshButtonVisiblity: false,
				FullScreenPageBusy: false,
				StationMapRelatedData: [{
					"StationName": "Ashok Park Main",
					"Latitude": 28.6716168,
					"Longitude": 77.1541321
				},{
					"StationName": "Barakhamba Road",
					"Latitude": 28.629907,
					"Longitude": 77.224159
				},{
					"StationName": "Central Sectt.",
					"Latitude": 28.615214,
					"Longitude": 77.211978
				},{
					"StationName": "Chandani Chowk",
					"Latitude": 28.657847,
					"Longitude": 77.230144
				},{
					"StationName": "Chawri Bazar",
					"Latitude": 28.649407,
					"Longitude": 77.226324
				},{
					"StationName": "Civil Lines",
					"Latitude": 28.676973,
					"Longitude": 77.224975
				},{
					"StationName": "Delhi Gate",
					"Latitude": 28.640258,
					"Longitude": 77.240395
				},{
					"StationName": "Inderlok",
					"Latitude": 28.673512,
					"Longitude": 77.170212
				},{
					"StationName": "ITO",
					"Latitude": 28.627204,
					"Longitude": 77.240953
				},{
					"StationName": "Jama Masjid",
					"Latitude": 28.6501617,
					"Longitude": 77.2353914
				},{
					"StationName": "Janpath",
					"Latitude": 28.625363,
					"Longitude": 77.219339
				},{
					"StationName": "Kanhaiya Nagar",
					"Latitude": 28.682386,
					"Longitude": 77.164742
				},{
					"StationName": "Karol Bagh",
					"Latitude": 28.64398,
					"Longitude": 77.188435
				},{
					"StationName": "Kashmeeri Gate",
					"Latitude": 28.667497,
					"Longitude": 77.228251
				},{
					"StationName": "Khan Market",
					"Latitude": 28.602036,
					"Longitude": 77.229221
				},{
					"StationName": "Kirti Nagar",
					"Latitude": 28.655833,
					"Longitude": 77.150703 
				},{
					"StationName": "Lal Quila",
					"Latitude": 28.656159,
					"Longitude": 77.24102
				},{
					"StationName": "Mandi House",
					"Latitude": 28.625899,
					"Longitude": 77.234296
				},{
					"StationName": "Moti Nagar",
					"Latitude": 28.65787,
					"Longitude": 77.142674
				},{
					"StationName": "New Delhi",
					"Latitude": 28.643054,
					"Longitude": 77.222344
				},{
					"StationName": "Patel Chowk",
					"Latitude": 28.623281,
					"Longitude": 77.214478
				},{
					"StationName": "Patel Nagar",
					"Latitude": 28.645178,
					"Longitude": 77.169097
				},{
					"StationName": "Pragati Maidan",
					"Latitude": 28.623186,
					"Longitude": 77.242761
				},{
					"StationName": "Pratap Nagar",
					"Latitude": 28.6671101,
					"Longitude": 77.1986353
				},{
					"StationName": "Pulbangash",
					"Latitude": 28.666398,
					"Longitude": 77.207372
				},{
					"StationName": "Punjabi Bagh",
					"Latitude": 28.672904,
					"Longitude": 77.146269
				},{
					"StationName": "R. K. Ashram Marg",
					"Latitude": 28.639268,
					"Longitude": 77.20845
				},{
					"StationName": "Rajeev Chowk",
					"Latitude": 28.632862,
					"Longitude": 77.219542
				},{
					"StationName": "Rajendra Place",
					"Latitude": 28.642456,
					"Longitude": 77.178082
				},{
					"StationName": "Satguru Ramsingh Marg",
					"Latitude": 28.662186,
					"Longitude": 77.157773
				},{
					"StationName": "Shadipur",
					"Latitude": 28.651558,
					"Longitude": 77.158194
				},{
					"StationName": "Shastri Nagar",
					"Latitude": 28.670048,
					"Longitude": 77.181856
				},{
					"StationName": "Shastri Park",
					"Latitude": 28.66832,
					"Longitude": 77.250287
				},{
					"StationName": "Tis Hazari",
					"Latitude": 28.667094,
					"Longitude": 77.216534
				},{
					"StationName": "Udyog Bhawan",
					"Latitude": 28.611014,
					"Longitude": 77.212244
				}],
				// InterChangeStationColors: []
			};
		}
	});
});