
/**
* @function
* Return true if a string is empty or null/undefined.
* Strings containing only whitespace will be considered empty.
*/
function stringEmptyOrNull(str)
{
	if(str == null)
	{
		return true;
	}
	else if(str.trim().length == 0)
	{
		return true;
	}
	else
	{
		return false;
	}
}


module.exports = stringEmptyOrNull;