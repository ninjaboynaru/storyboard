import 'whatwg-fetch';


/**
* API wrapper for the StoryBoard server API.
* It is assumed that the website and thus this library, are being run on the same URL as the server.
*/
const storyBoardApi = new function() {

	let _apiUrl = '/api';


	/**
	* @callback requestCallback
	* @callback-syntax- callback(error, story, networkError)
	*
	* @param {object} error - Error from the server. Is null if nothing went wrong.
	* @param {object} story - Story object to retrieve. May be an array if getting random, recent, or user stories.
	* Is null if an error occurred.
	*
	* @param {object}networkError - Error resulting from network/internet issues. Is null if no network error occurred.
	*
	*/

	/**
	* @function
	* Get a story based on its id OR title. Only specify one.
	*
	* @param {object} options
	* @param {string} options.id - ID of the story to get
	* @param {string} options.title -  Title of the story to get
	* @param {array} options.fields - String array of fields to be returned on the story. The id field is always returned.
	* @param {requestCallback} callback
	*/
	this.getStory = function(options, callback)
	{
		let requestUrl = _apiUrl + '/story/?';

		if(options.title)
		{
			requestUrl += `title=${options.title}&`;
		}
		else if(options.id)
		{
			requestUrl += `id=${options.id}&`;
		}

		if(options.fields && Array.isArray(options.fields) )
		{
			let fieldsString = options.fields.join(',');
			requestUrl += `fields=${fieldsString}`
		}

		const onResponse = _handleFetchResponse.bind(undefined, callback);
		const onNetworkError = _handleFetchNetworkError.bind(undefined, callback);
		fetch(requestUrl, {method:'GET'}).then(onResponse).catch(onNetworkError);
	}

	/**
	* @function
	* Get an array of recent stories.
	*
	* @param {number} count - The amount of recent stories to get. The API may have a limit.
	* @param {object} options
	* @param {array} options.fields - String array of fields to be returned on the story. The id field is always returned.
	* @param {requestCallback} callback
	*/
	this.getRecentStories = function(count, options, callback)
	{
		let requestUrl = _apiUrl + `/story/recent/?count=${count}&`;


		if(options.fields)
		{
			let fieldsString = options.fields.join(',');
			requestUrl += `fields=${fieldsString}`;
		}

		const onResponse = _handleFetchResponse.bind(undefined, callback);
		const onNetworkError = _handleFetchNetworkError.bind(undefined, callback);
		fetch(requestUrl, {method:'GET'}).then(onResponse).catch(onNetworkError);
	}

	/**
	* @function
	* Get an array of random stories.
	*
	* @param {number} count - The amount of random stories to get. The API may have a limit.
	* @param {object} options
	* @param {array} options.fields - String array of fields to be returned on the story. The id field is always returned.
	* @param {requestCallback} callback
	*/
	this.getRandomStories = function(count, options, callback)
	{
		let requestUrl = _apiUrl + `/story/random/?count=${count}&`;


		if(options.fields)
		{
			let fieldsString = options.fields.join(',');
			requestUrl += `fields=${fieldsString}`;
		}

		const onResponse = _handleFetchResponse.bind(undefined, callback);
		const onNetworkError = _handleFetchNetworkError.bind(undefined, callback);
		fetch(requestUrl, {method:'GET'}).then(onResponse).catch(onNetworkError);
	}
	
	/**
	* @function
	* Get an array of stories from a user.
	*
	* @param {string} userId - ID of the user (google API id)
	* @param {number} count - The amount of stories to get. The API may have a limit.
	* @param {number} count - The amount of stories to get. The API may have a limit.
	* @param {object} options
	* @param {array} options.fields - String array of fields to be returned on the story. The id field is always returned.
	* @param {requestCallback} callback
	*/
	this.getUserStories = function(userId, count, options, callback)
	{
		let requestUrl = _apiUrl + `/story/user/?id=${userId}&count=${count}&`;
		
		if(options.fields)
		{
			let fieldsString = options.fields.join(',');
			requestUrl += `fields=${fieldsString}`;
		}
		
		const onResponse = _handleFetchResponse.bind(undefined, callback);
		const onNetworkError = _handleFetchNetworkError.bind(undefined, callback);
		fetch(requestUrl, {method:'GET'}).then(onResponse).catch(onNetworkError);
	}

	/**
	* @function
	* Create a story
	*
	* @param {string} title
	* @param {string} body
	* @param {string} userIdToken
	* @param {requestCallback} callback
	*/
	this.createStory = function(title, author, body, userIdToken, callback)
	{
		let requestUrl = _apiUrl + '/create';
		let requestBody = {title:title, author:author, body:body, idToken:userIdToken};
		requestBody = JSON.stringify(requestBody);

		let fetchOptions = {
			method:'POST',
			headers: {'Content-Type': 'application/json'},
			body: requestBody
		};

		const onResponse = _handleFetchResponse.bind(undefined, callback);
		const onNetworkError = _handleFetchNetworkError.bind(undefined, callback);
		fetch(requestUrl, fetchOptions).then(onResponse).catch(onNetworkError);
	}



	function _handleFetchResponse(callback, response)
	{
		response.json().then(function(jsonResponse){
			callback(jsonResponse.error, jsonResponse.story, null);
		});
	}

	function _handleFetchNetworkError(callback, error)
	{
		callback(null, null, error);
	}
}



export default storyBoardApi;



