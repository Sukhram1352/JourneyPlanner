sap.ui.define([], function() {
	"use strict";

	var oUtility = {

		/**
		 * Check if value exists (not null or undefined). Useful for filtering operations
		 * @param {*} vValue - Value to check
		 * @returns {boolean} True if exists
		 * @public
		 */
		exists: function(vValue) {
			return vValue != null;
		},

		/**
		 * Function to find index of object based on property in an array 
		 * @public 
		 * @param{array} aColumnList Array to be used to search
		 * @param{string} sAttr Name used to search object in Array
		 *  @param{string} sValue value used to search object in Array
		 * @return{integer} index returned
		 */
		findWithAttr: function(aColumnList, sAttr, sValue) {
			for (var intI = 0; intI < aColumnList.length; intI += 1) {
				if (aColumnList[intI] && aColumnList[intI][sAttr] === sValue) {
					return intI;
				}
			}
			return -1;
		},

		/**
		 * Function to remove metadata from a object
		 * @public 
		 * @param	{Object} oObject Object from which metadata is to be removed
		 * @return	{Object} oObject Object with deleted metadata
		 */
		removeMetadata: function(oObject) {

			// Delete metadata from Object directly
			if (oObject) {
				if (oObject.constructor === Array) {
					oObject.map(oUtility.removeMetadata.bind(oUtility));
				} else if (oObject.constructor === Object) {
					delete oObject.__metadata;
				}

				// Loop through all properties of the object
				for (var oProperty in oObject) {
					if (oObject.hasOwnProperty(oProperty) && typeof oObject[oProperty] === "object" && oObject[oProperty]) {
						if (oObject[oProperty].hasOwnProperty("__deferred")) {
							delete oObject[oProperty];
						} else {
							// Remove metadata tag
							// Call method recursively
							oUtility.removeMetadata(oObject[oProperty]);
						}
					}
				}
			}

			return oObject;
		},

		/**
		 * Function to Sanitize the Entity Result Data with removal of meta data tags
		 * @param {object} oResultSetData Result set data object
		 * @param {boolean} bIsEntitySetRel1on1  If the EntitySet was 1on1  relation than object
		 *										Otherwise Array of Object should be returned
		 * @returns {object/object[]} Sanitized result Object/Array
		 */
		sanitizeEntitySetResult: function(oResultSetData, bIsEntitySetRel1on1) {
			var oResultSet = oResultSetData;
			//Remove the meta data tags
			oUtility.removeMetadata(oResultSet);

			//If EntitySet was 1on1 than result should be an object if not than return {} object
			if (bIsEntitySetRel1on1) {
				if (!oResultSet || (oResultSet && oResultSet.constructor !== Object)) {
					oResultSet = {};
				}
			} else { //If EntitySet was not 1on1 than result should be an Array if not than return [] object
				if (oResultSet && oResultSet.constructor === Array) {
					oResultSet = oResultSet;
				} else if (oResultSet && oResultSet.results) {
					oResultSet = oResultSet.results;
				} else {
					oResultSet = [];
				}
			}
			return oResultSet;
		},

		/**
		 * Get source array element with a given attribute (property) value
		 * @param {Array} aSourceArray - Search source
		 * @param {string} sAttribute - Attribute name
		 * @param {*} vValue - Attribute value to find
		 * @returns {object} Element or empty object, if search failed
		 * @public
		 */
		getObjectWithAttr: function(aSourceArray, sAttribute, vValue) {
			if (!Array.isArray(aSourceArray)) {
				return {};
			}

			return aSourceArray.find(function(oSourceElement) {
				return oSourceElement[sAttribute] === vValue;
			}) || {};
		},

		/**
		 * Method which return Array of all objects fulfilling the conditional value
		 * from Array of Object for a given property
		 * @public
		 * @param   {Array}  aColumnList Array of Objects
		 * @param   {String} sAttr       Property/Attribute Name
		 * @param   {String} sValue      Conditional Value
		 * @returns {Object} The Object matching condition
		 */
		getArrayOfObjectsWithAttr: function(aColumnList, sAttr, sValue) {

			var aArrayOfObjects = [];

			for (var intI = 0; intI < aColumnList.length; intI++) {
				if (aColumnList[intI][sAttr] === sValue) {
					aArrayOfObjects.push(aColumnList[intI]);
				}
			}
			return aArrayOfObjects;
		}
	};

	return oUtility;
});