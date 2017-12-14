

/**
* @function
* Given an StoryBoard API error or network error, constructs a user facing error.
* If no error arguments are provided, a generic, "something went wrong" error string is returned.
*
* @param {object} error - A StoryBoard API error
* @param {object} networkError - A StoryBoard API networkError (created when using whatwg-fetch library)
*/
function buildUserErrorMessage(error, networkError) {
	let userErrorMessage;

	if(error)
	{
		userErrorMessage = "An error prevented this page from loading. We're working hard to fix it. Come back later";
		userErrorMessage += `\r\n HTTP Status: ${error.httpCode}`
		userErrorMessage += `\r\n Error Code: ${error.errorCode}`;
		userErrorMessage += `\r\n Error Description: ${error.description}`;
		userErrorMessage += `\r\n Error Message: ${error.message}`;
	}
	else if(networkError)
	{
		userErrorMessage = "A netowrk error prevented this story from loading. Check your internet connection or try again later";
	}
	else
	{
		userErrorMessage = "Oops, looks like something went wrong. We'll get right on it. \r\n Try again later.";
	}

	return userErrorMessage;
}


export default buildUserErrorMessage;

