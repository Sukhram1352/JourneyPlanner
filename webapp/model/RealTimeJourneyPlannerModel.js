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
				MetroStations: [{
					"StationName": "Adarsh Nagar"
				},{
					"StationName": "Barakhambha Road"
				},{
					"StationName": "Central Secretariat"
				},{
					"StationName": "Chandni Chowk"
				},{
					"StationName": "Chawri Bazar"
				},{
					"StationName": "Delhi Cantonment"
				},{
					"StationName": "Hazrat Nizamuddin"
				},{
					"StationName": "Indira Gandhi International Airport"
				},{
					"StationName": "Indraprastha"
				},{
					"StationName": "IP Extension"
				},{
					"StationName": "Jhandewalan"
				},{
					"StationName": "Kashmere Gate"
				},{
					"StationName": "IP Extension"
				},{
					"StationName": "Mansarovar Park"
				},{
					"StationName": "Qutab Minar"
				},{
					"StationName": "Bahadurgarh City Park"
				},{
					"StationName": "Huda City Center"
				}],
				NewJourney: {
					"JourneyGuid": "",
					"FromStation": "",
					"ToStation": ""
				},
				JourneyRoutes: [{
					"Route": "Preferred Route",
					"RouteKey" : "PreferredRoute",
					"JourneyTime": "52 Min",
					"NormalFare": "₹ 60",
					"ConcessionalFare": "₹ 40",
					"StartPointStation": "Bahadurgarh City Park",
					"EndPointStation": "Huda City Centre",
					"NoOfStations": "22",
					"NoOfInterChange": "2",
					"Stations": [{
						"StationName": "Bahadurgarh City Park",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Bus Stand",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Rajdhani Park",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Udyog Vihar",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Paschhim Vihar",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Punjabi Bagh",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Kirti Nagar",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "Shadipur",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Patel Nagar",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Rajendra Place",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Karol Bagh",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Jhandewalan",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Rajiv Chowk",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "Central Secretariat",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Jor Bagh",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "INA",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "AIIMS",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Green Park",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Hauz Khas",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Qutab Minar",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "IFFCO Chowk",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Huda City Centre",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					}]
				},{
					"Route": "Optional Route 1",
					"RouteKey" : "OptionalRoute1",
					"JourneyTime": "65 Min",
					"NormalFare": "₹ 70",
					"ConcessionalFare": "₹ 60",
					"StartPointStation": "Bahadurgarh City Park",
					"EndPointStation": "Huda City Centre",
					"NoOfStations": "26",
					"NoOfInterChange": "3",
					"Stations": [{
						"StationName": "Bahadurgarh City Park",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Bus Stand",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Rajdhani Park",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Udyog Vihar",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Paschhim Vihar",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Punjabi Bagh",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Kirti Nagar",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "Moti Nagar",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Ramesh Nagar",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Dwarka",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Nawada",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Uttam Nagar",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Nangli",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Najafgarh",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "Mayapuri",
						"InterChangeStation": false,
						"MetroLine": "Orange"
					},{
						"StationName": "Naraina Vihar",
						"InterChangeStation": false,
						"MetroLine": "Orange"
					},{
						"StationName": "Delhi Canttonment",
						"InterChangeStation": false,
						"MetroLine": "Orange"
					},{
						"StationName": "Bhikaji Cama Place",
						"InterChangeStation": false,
						"MetroLine": "Orange"
					},{
						"StationName": "Sarojini Nagar",
						"InterChangeStation": false,
						"MetroLine": "Orange"
					},{
						"StationName": "INA",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "AIIMS",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Green Park",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Hauz Khas",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Qutab Minar",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "IFFCO Chowk",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Huda City Centre",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					}]
				},{
					"Route": "Optional Route 2",
					"RouteKey" : "OptionalRoute2",
					"JourneyTime": "80 Min",
					"NormalFare": "₹ 85",
					"ConcessionalFare": "₹ 75",
					"StartPointStation": "Bahadurgarh City Park",
					"EndPointStation": "Huda City Centre",
					"NoOfStations": "27",
					"NoOfInterChange": "3",
					"Stations": [{
						"StationName": "Bahadurgarh City Park",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Bus Stand",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Rajdhani Park",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Udyog Vihar",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Paschhim Vihar",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Punjabi Bagh",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Kirti Nagar",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "Moti Nagar",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Ramesh Nagar",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Rajouri Garden",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Subhash Nagar",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Tilak Nagar",
						"InterChangeStation": false,
						"MetroLine": "Blue"
					},{
						"StationName": "Janakpuri",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "Dashrath Puri",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "Palam",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "Shankar Vihar",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "Vasant Vihar",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "Munirka",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "R.K Puram",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "I.I.T.",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "INA",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "AIIMS",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Green Park",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Hauz Khas",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Qutab Minar",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "IFFCO Chowk",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Huda City Centre",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					}]
				},{
					"Route": "Optional Route 3",
					"RouteKey" : "OptionalRoute3",
					"JourneyTime": "90 Min",
					"NormalFare": "₹ 95",
					"ConcessionalFare": "₹ 80",
					"StartPointStation": "Bahadurgarh City Park",
					"EndPointStation": "Huda City Centre",
					"NoOfStations": "26",
					"NoOfInterChange": "3",
					"Stations": [{
						"StationName": "Bahadurgarh City Park",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Bus Stand",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Rajdhani Park",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Udyog Vihar",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Paschhim Vihar",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Punjabi Bagh",
						"InterChangeStation": false,
						"MetroLine": "Green"
					},{
						"StationName": "Inderlok",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "Shastri Nagar",
						"InterChangeStation": false,
						"MetroLine": "Red"
					},{
						"StationName": "Pratap Nagar",
						"InterChangeStation": false,
						"MetroLine": "Red"
					},{
						"StationName": "Pulbangash",
						"InterChangeStation": false,
						"MetroLine": "Red"
					},{
						"StationName": "Tees Hazari",
						"InterChangeStation": false,
						"MetroLine": "Red"
					},{
						"StationName": "Shastri Park",
						"InterChangeStation": false,
						"MetroLine": "Red"
					},{
						"StationName": "Seelampur",
						"InterChangeStation": false,
						"MetroLine": "Red"
					},{
						"StationName": "Welcome",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "Krishna Nagar",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "Karkarduma",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "I.P. Extension",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "Mayur Vihar",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "Lajpat Nagar",
						"InterChangeStation": false,
						"MetroLine": "Pink"
					},{
						"StationName": "INA",
						"InterChangeStation": true,
						"MetroLine": ""
					},{
						"StationName": "AIIMS",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Green Park",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Hauz Khas",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Qutab Minar",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "IFFCO Chowk",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					},{
						"StationName": "Huda City Centre",
						"InterChangeStation": false,
						"MetroLine": "Yellow"
					}]
				}]
			};
		}
	});
});