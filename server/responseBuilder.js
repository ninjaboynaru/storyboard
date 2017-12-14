
/**
* Module for building the APIs' responses and errors.
*/
const responseBuilder = {
	errorBuilder: {},
	buildResponse: function(story = null, error = null) {
		let responseObject = {
			story: story,
			error: error
		};

		if(responseObject.story)
		{
			if(Array.isArray(responseObject.story) )
			{
				responseObject.story.forEach(responseBuilder._prepStoryForClient);
			}
			else
			{
				responseBuilder._prepStoryForClient(responseObject.story);
			}
		}

		return responseObject;
	},

	/**
	* @function
	* Remove sensitive or unnecessary fields from a Story object/databse record.
	* Also renames the _id field to id.
	*/
	_prepStoryForClient: function(storyObject)
	{
		if (storyObject) {
			if (storyObject._id) {
				storyObject.id = storyObject._id;
				delete storyObject._id;
			}
			if (storyObject.__v) {
				delete storyObject.__v;
			}
			if(storyObject.user && storyObject.user._id)
			{
				storyObject.user.id = storyObject.user._id;
				delete storyObject.user._id;
			}
		}

		return storyObject;
	}
};

/**
* @function
* @private
* Create an error object to be sent with an API response.
*
* This method should not be used directly.
* Instead a more specific error builder method should be used.
*/
responseBuilder.errorBuilder._buildError = function(errorTitle=null,errorDescription=null,errorMessage=null,errorHttpCode=null,errorCode=-1)
{
	const errorObject = {
		error: errorTitle,
		description: errorDescription,
		message: errorMessage,
		httpCode: errorHttpCode,
		errorCode: errorCode,
		send: function(expressResponseObject) {
			expressResponseObject.status(errorObject.httpCode);
			expressResponseObject.json(responseBuilder.buildResponse(null, errorObject) );
		}
	};
	
	return errorObject;
};

responseBuilder.errorBuilder.unauthorized = function({ errorCode, message } = {}) {
	const title = 'Unauthorized';
	const description = 'The authorization information you sent is invalid or null.';
	const httpCode = 401;
	return responseBuilder.errorBuilder._buildError(title, description, message, httpCode, errorCode);
}
responseBuilder.errorBuilder.contentType = function({ errorCode, message } = {}) {
	const title = 'Unsupported content-type';
	const description = 'The content-type specified in the header is not supported or was not specified at all';
	const httpCode = 415;
	return responseBuilder.errorBuilder._buildError(title, description, message, httpCode, errorCode);
};

responseBuilder.errorBuilder.missngQueryString = function({ errorCode, message } = {}) {
	const title = 'Missing required query string';
	const description = 'The required query string(s) were missing';
	const httpCode = 400;
	return responseBuilder.errorBuilder._buildError(title, description, message, httpCode, errorCode);
};

responseBuilder.errorBuilder.invalidQueryFormat = function({errorCode, message} = {})
{
	const title = 'Invalid query string format';
	const description = 'One or all of provided query strings are in an invalid format/type';
	const httpCode = 400;
	return responseBuilder.errorBuilder._buildError(title, description, message, httpCode, errorCode);
};

responseBuilder.errorBuilder.internalServerError = function({ errorCode, message } = {}) {
	const title = 'Internal server error';
	const description = 'An internal server error prevented your request form beaing processed';
	const httpCode = 500;
	return responseBuilder.errorBuilder._buildError(title, description, message, httpCode, errorCode);
};

responseBuilder.errorBuilder.invalidBody = function({ errorCode, message } = {}) {
	const title = 'Invalid request body';
	const description = `The request body was not valid or was empty`;
	const httpCode = 400;
	return responseBuilder.errorBuilder._buildError(title, description, message, httpCode, errorCode);
};

responseBuilder.errorBuilder.bodyTooLarge = function({ errorCode, message, maxSize } = {}) {
	const title = 'Request body too large';
	let description = 'The request body was too large';
	if (maxSize || maxSize === 0) {
		description += ` Max size: ${maxSize}`;
	}
	const httpCode = 400;
	return responseBuilder.errorBuilder._buildError(title, description, message, httpCode, errorCode);
};

responseBuilder.errorBuilder.send = function(httpResponseObject, errorObject)
{
	httpResponseObject.status(errorObject.httpCode);
	httpResponseObject.json(responseBuilder.buildResponse(null, errorObject) );
}

module.exports = responseBuilder;
