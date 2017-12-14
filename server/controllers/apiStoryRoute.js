const express = require('express');
const StoryModel = require('../models/story.js');

const responseBuilder = require('../responseBuilder.js');
const errorBuilder = responseBuilder.errorBuilder;

const stringEmptyOrNull = require('../utils/stringEmptyOrNull.js');
const objectIdIsValid = require('../utils/objectIdIsValid.js');
const fieldsQueryToProjection = require('../utils/fieldsQueryToProjection.js');

const routes = express.Router();
routes.get('/api/story', [apiStoryValidate, apiStory]);


/**
* @Middleware
* Validate the route request before passing control to the next route handler.
*/
function apiStoryValidate(request, response, next) {

	const titleQuery = request.query.title;
	const idQuery = request.query.id;

	if (stringEmptyOrNull(titleQuery) && stringEmptyOrNull(idQuery)) {
		errorBuilder.missngQueryString().send(response);
	}
	else if(idQuery && objectIdIsValid(idQuery) == false)
	{
		// attempting to query an invalid id will return no results and throw an error. Just end it now!
		response.status(200);
		response.json(responseBuilder.buildResponse(null, null) );
	}
	else
	{
		next();
	}
}

/**
* @Endpoint
* Retrieve a story based on its title or id
*/
function apiStory(request, response, next) {

	const titleQuery = request.query.title;
	const idQuery = request.query.id;
	const fieldsQuery = request.query.fields;

	let databseSearch;
	let projection;

	if (titleQuery) 
	{
		databseSearch = { title: titleQuery };
	}
	else if (idQuery)
	{
		databseSearch = { _id: idQuery };
	}

	if(fieldsQuery)
	{
		projection = fieldsQueryToProjection(fieldsQuery);
	}


	StoryModel.findOne(databseSearch).select(projection).lean().populate('user').exec(function(error, story) {
		if (error)
		{
			errorBuilder.internalServerError().send(response);
		}
		else
		{
			response.status(200);
			response.json(responseBuilder.buildResponse(story, null));
		}
	});
}


module.exports = routes;


