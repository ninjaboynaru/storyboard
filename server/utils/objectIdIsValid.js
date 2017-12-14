const ObjectId = require('mongoose').Types.ObjectId;

/**
* @function
* Determine if a string is a valid MongoDB object id.
**/
function objectIdIsValid(idString)
{
	if(ObjectId.isValid(idString) == false)
	{
		/* ObjectId.isValid() is a built in method for checking _id validity (checks for a null, 12 or 24 character string) */
		return false;
	}
	else if(new ObjectId(idString) != idString)
	{
		/* A valid _id string passed through the ObjectId() constructor, will result in the SAME string.
		An non _id string passed through will result in a different string. */
		return false
	}
	
	/* An invalid _id may past the first test simply because of its character length, thus, the second test is needed. */

	return true;
}


module.exports = objectIdIsValid;