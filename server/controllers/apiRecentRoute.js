const express = require('express');
const StoryModel = require('../models/story.js');
const responseBuilder = require('../responseBuilder.js');
const errorBuilder = responseBuilder.errorBuilder;

const stringEmptyOrNull = require('../utils/stringEmptyOrNull.js');
const fieldsQueryToProjection = require('../utils/fieldsQueryToProjection.js');

const routes = express.Router();
routes.get('/api/story/recent', [apiRecentValidate, apiRecent]);



/**
* @Middleware
* Validate the route request before passing control to the next route handler.
*/
function apiRecentValidate(request, response, next)
{
	const countQuery = request.query.count;

	if(stringEmptyOrNull(countQuery) == true )
	{
		errorBuilder.missngQueryString().send(response);
	}
	else if(Number.isNaN(Number(countQuery)) == true)
	{
		errorBuilder.invalidQueryFormat().send(response);;
	}

	else
	{
		next();
	}
}

/**
* @Endpoint
* Retrieve an array of the most recent stories
*/
function apiRecent(request, response)
{
	const countQuery = request.query.count;
	const fieldsQuery = request.query.fields;
	const maxCount = 20;

	let countQueryAsNumber = Number(countQuery);
	let projection;

	if(countQueryAsNumber > maxCount || countQueryAsNumber <= 0)
	{
		countQueryAsNumber = maxCount;
	}
	if(fieldsQuery)
	{
		projection = fieldsQueryToProjection(fieldsQuery);
	}


	StoryModel.find().sort({_id:-1}).limit(countQueryAsNumber).select(projection).populate('user').lean().exec(function(error, stories) {
		if (error)
		{
			errorBuilder.internalServerError().send(response);
		}
		else
		{
			response.status(200);
			response.json(responseBuilder.buildResponse(stories, null));
		}
	});
}



module.exports = routes;




