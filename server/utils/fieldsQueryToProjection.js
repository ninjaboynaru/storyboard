const stringEmptyOrNull = require('./stringEmptyOrNull');

/**
* @function
* Convert a comma delimited string into an object to be used for database projections.
* Empty fields within the string will not be added to the final object.
*
* @param {string} fieldsString - Comma delimited string. If it is empty or null, null is returned
*
* @Example
* "title,author" -> {title:1, author:1}
* "title, ,author, name" -> {title:1, author:1, name:1}
*/
function fieldsQueryToProjection(fieldsString)
{
	if(stringEmptyOrNull(fieldsString) )
	{
		return null;
	}
	else
	{
		let fieldsArray = fieldsString.split(',');
		let projection = {};
		fieldsArray.forEach(function(field){
			if(stringEmptyOrNull(field) )
			{
				/*mongodb aggregate() method will throw an error for empty (all white space) projection fields*/
				return;
			}
			else
			{
				projection[field.trim()] = 1;
			}
		});

		return projection;
	}
}


module.exports = fieldsQueryToProjection;