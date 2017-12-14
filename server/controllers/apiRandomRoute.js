const express = require('express');
const StoryModel = require('../models/story.js');
const responseBuilder = require('../responseBuilder.js');
const errorBuilder = responseBuilder.errorBuilder;

const stringEmptyOrNull = require('../utils/stringEmptyOrNull.js');
const fieldsQueryToProjection = require('../utils/fieldsQueryToProjection.js');

const routes = express.Router();
routes.get('/api/story/random', [apiRandomValidate, apiRandom]);




/**
* @Middleware
* Validate the route request before passing control to the next route handler.
*/
function apiRandomValidate(request, response, next)
{
	const countQuery = request.query.count;

	if(stringEmptyOrNull(countQuery) == true )
	{
		errorBuilder.missngQueryString().send(response);
	}
	else if(Number.isNaN(Number(countQuery)) == true)
	{
		errorBuilder.invalidQueryFormat().send(response);
	}
	else
	{
		next();
	}
}

/**
* @Endpoint
* Retrieve an array of random stories
*/
function apiRandom(request, response)
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

	
	const aggregate = StoryModel.aggregate().sample(countQueryAsNumber);
	aggregate.lookup({from:'users', localField:'user', foreignField:'_id', as:'user'}).unwind('user');
	if(projection)
	{
		// force projection to return user by default to match default behavior of the other GET endpoints
		projection.user = 1;
		
		// projection must be added conditionally - adding null projection to aggregate results in error
		aggregate.project(projection);
	}


	aggregate.exec(function(error, stories){
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



