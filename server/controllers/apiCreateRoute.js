const express = require('express');
const jsonBody = require('body/json');
const StoryModel = require('../models/story.js');
const UserModel = require('../models/user.js');

const responseBuilder = require('../responseBuilder.js');
const errorBuilder = responseBuilder.errorBuilder;
const errorEnum = require('../../config/errorEnum');

const inputValidation = require('../../config/inputValidation.json');
const stringEmptyOrNull = require('../utils/stringEmptyOrNull.js');
const verifyIdToken = require('../verifyIdToken.js');

const maxBodySize = inputValidation.title.maxLength + inputValidation.author.maxLength + inputValidation.body.maxLength + 5000;

const routes = express.Router();
routes.post('/api/create', [apiCreateValidate, apiCreateAuthValidate, apiCreate]);


/**
* @Middleware
* Validate the route request and parse the request body to JSON for the next route.
* Sets request.body to the parsed json before passing control to the next route handler.
*/
function apiCreateValidate(request, response, next) {
	const contentTypeHeader = request.header('content-type');

	if (stringEmptyOrNull(contentTypeHeader) || contentTypeHeader.toLowerCase().startsWith('application/json') == false)
	{
		errorBuilder.contentType(errorEnum.CONTENT_TYPE_NOT_JSON).send(response);
	}
	else
	{
			jsonBody(request, response, { limit: maxBodySize }, onJsonParsed);
	}

	function onJsonParsed(error, body) {

		if (error) {
			if (error.name == 'SyntaxError')
			{
				errorBuilder.invalidBody().send(response);
			}
			else if (error.type == 'entity.too.large')
			{
				errorBuilder.bodyTooLarge(errorEnum.INVALID_API_CREATE_PARAMS).send(response);
			}
			else
			{
				errorBuilder.internalServerError(errorEnum.UNKNOWN_JSON_PARSING_ERROR).send(response);
			}
		}
		else if (Object.keys(body) == 0)
		{
			errorBuilder.invalidBody().send(response);
		}
		else if(body.title == undefined || body.body == undefined || body.idToken == undefined)
		{
			errorBuilder.invalidBody(errorEnum.MISSING_JSON_BODY_PARAMS).send(response);
		}
		else
		{
			request.body = body;
			next();
		}
	}
}

/***
* @Middleware
* Validate the idToken (google id token) property of the JSON request body, and extract a users' id and name from it.
* The user id is a unique identifier provided by google that can also be used as database _id to identify the user in the database.
*
* Sets - request.userInfo
* request.userInfo.id - Database identifier provided by google
* request.userInfo.name
*
* If the idToken is == -1, the userInfo object is set to an anonymous user
*
* For more info -- https://developers.google.com/identity/sign-in/web/backend-auth
*/
function apiCreateAuthValidate(request, response, next)
{
	const idToken = request.body.idToken;
	if(idToken == -1)
	{
		request.userInfo = UserModel.getDefaultUserInfo();
		next();
	}
	else
	{
		verifyIdToken(idToken, function(error, userInfo){
			if(error)
			{
				response.set('WWW-Authenticate', 'OAuth');
				responseBuilder.errorBuilder.unauthorized().send(response);
			}
			else
			{
				request.userInfo = {
					id:userInfo.sub,
					name:userInfo.name
				}
				next();
			}

		});
	}
}


/**
* @Endpoint
*/
function apiCreate(request, response)
{	
	const userId = request.userInfo.id;
	const userName = request.userInfo.name;
	let userObject;


	/** Update/Create the user in case the user changed their name or is a new user*/
	UserModel.findOneAndUpdate({_id:userId}, {name:userName}, {upsert:true, new:true} ).lean().exec(onUserFound);

	function onUserFound(error, user)
	{
		if(error)
		{
			errorBuilder.internalServerError().send(response);
		}
		else
		{
			let storyInformation = {title:request.body.title, body:request.body.body, author:request.body.author, user:userId};
			let newStory = new StoryModel(storyInformation);

			const inputValidationError = newStory.validateSync();
			if(inputValidationError)
			{				
				errorBuilder.invalidBody(errorEnum.INVALID_API_CREATE_PARAMS).send(response);
			}
			else
			{
				userObject = user;
				newStory.save(onStorySave);
			}
		}
	}



	function onStorySave(error, savedStory)
	{
		if(error) 
		{
			errorBuilder.internalServerError().send(response);
		}
		else
		{
			let storyObject = savedStory.toObject();
			storyObject.user = userObject;

			response.status(200);
			response.json(responseBuilder.buildResponse(storyObject, null) );
		}
	}
}







module.exports = routes;




