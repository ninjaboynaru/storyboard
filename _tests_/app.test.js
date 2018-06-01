const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const mongoose = require('mongoose');
const express = require('express')
const appRoutes = require('../server/controllers/_app.js');
const mongoConfig = require('../config/mongoConfig.json');

const randomString = require('./randomString.js');

chai.use(chaiHttp);
const app = express();
app.use('/', appRoutes);
let server;



before('Start database', function(done){
	mongoose.Promise = global.Promise;
	mongoose.connect(mongoConfig.testingUri, {useMongoClient:true}).then(OnMongooseSuccess, OnMongooseError);

	function OnMongooseSuccess()
	{
		done();
	}

	function OnMongooseError(error)
	{
		expect.fail(null,null, 'Error starting mongoose database: ' + error);
	}
});

before('Start server', function(done){
	server = app.listen(8080, function(){
		done();
	})
});

after('Close server', function(){
	server.close();
});

after('Close database', function(done){
	mongoose.disconnect(function(){
		done();
	});
});


describe('Story POST and GET', function() {

	const storyTitle = randomString(22, true);
	const storyAuthor = randomString(6, false)
	const storyBody = randomString(2000, true);
	const idToken = -1;

	let serverResponse;

	it('Can create a story', function(done){
		let storyObject = {title:storyTitle, author:storyAuthor, body:storyBody, idToken:idToken};
		let request = chai.request(server).post('/api/create');

		request.set('content-type', 'application/json');
		request.send(storyObject);
		request.end(function(error, response){
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body).to.exist;

			serverResponse = response.body;
			done();
		});
	});

	it('Story creation response has null error', function(){
		expect(serverResponse).to.have.property('error', null);

	});

	it('Story creation response has story we created', function(){
		expect(serverResponse).to.have.property('story');
		expect(serverResponse.story).to.have.property('id');
		expect(serverResponse.story).to.have.property('title', storyTitle);
		expect(serverResponse.story).to.have.property('author', storyAuthor);
		expect(serverResponse.story).to.have.property('body', storyBody);
	});

	it('Story creation response has anonymous user', function(){
		expect(serverResponse.story).to.have.property('user');
		expect(serverResponse.story.user).to.have.property('id', '-1');
		expect(serverResponse.story.user).to.have.property('name', 'anonymous');
	});

	it('Can get created story by its id', function(done){
		let id = serverResponse.story.id;
		chai.request(server).get(`/api/story/?id=${id}`).end(function(error, response){
			expect(error).to.not.exist;
			expect(response).to.be.json;
			expect(response.body).to.exist;

			expect(response.body).to.deep.equal(serverResponse);
			done();
		});

	});

	it('Can get created story by its title', function(done){
		chai.request(server).get(`/api/story/?title=${storyTitle}`).end(function(error, response){
			expect(error).to.not.exist;
			expect(response).to.be.json;
			expect(response.body).to.exist;

			expect(response.body).to.deep.equal(serverResponse);
			done();
		});
	});

});


describe('Error testing', function(){

	const storyTitle = randomString(22, true);
	const storyAuthor = randomString(6, false)
	const storyBody = randomString(2000, true);
	const idToken = 15;

	it('Can create story with invalid idToken and get back an error', function(done){
		let storyObject = {title:storyTitle, author:storyAuthor, body:storyBody, idToken:idToken};
		let request = chai.request(server).post('/api/create');

		request.set('content-type', 'application/json');
		request.send(storyObject);
		request.end(function(error, response){
			expect(response.body).to.exist;
			expect(response.body.error).to.exist;
			expect(response.status).to.be.oneOf([401,403]);
			done();
		});
	});

	it('Can create story missing parameters and get back an error', function(done){
		let storyObject = {author:storyAuthor, body:storyBody, idToken:idToken};
		let request = chai.request(server).post('/api/create');

		request.set('content-type', 'application/json');
		request.send(storyObject);
		request.end(function(error, response){
			expect(response.body).to.exist;
			expect(response.body.error).to.exist;
			done();
		});
	});
})

describe('Story GET recent, random and user stories', function(){

	const storiesToCreate = 10;
	let createdStories = [];

	/**
	* Recursively create an ammount of Stories
	*/
	function massCreateStories(storiesToCreate, callback)
	{
		if(storiesToCreate <= 0 || storiesToCreate == null)
		{
			callback();
		}
		else
		{
			const storyTitle = randomString(22, true);
			const storyAuthor = randomString(6, false);
			const storyBody = randomString(2000, true);
			const idToken = -1;

			let storyObject = {title:storyTitle, author:storyAuthor, body:storyBody, idToken:idToken};

			let request = chai.request(server).post('/api/create');
			request.set('content-type', 'application/json');
			request.send(storyObject);
			request.end(function(error, response){
				expect(error).to.not.exist;
				expect(response).to.have.status(200);
				expect(response).to.be.json;
				expect(response.body).to.exist;

				expect(response.body).to.have.property('error', null);
				expect(response.body).to.have.property('story');
				expect(response.body.story).to.have.property('id');
				expect(response.body.story).to.have.property('title', storyTitle);
				expect(response.body.story).to.have.property('author', storyAuthor);
				expect(response.body.story).to.have.property('body', storyBody);

				expect(response.body.story).to.have.property('user');
				expect(response.body.story.user).to.have.property('id', '-1');
				expect(response.body.story.user).to.have.property('name', 'anonymous');

				if(error || response.body.error)
				{
					if(callback == massCreateStories)
					{
						// prevent infinite loop
						return;
					}
					else
					{
						callback();
					}
				}
				else
				{
					createdStories.push(response.body.story);
					massCreateStories(storiesToCreate-1, callback);
				}
			});
		}
	}


	it('Can create 10 stories and get a correct response for each one', function(done){
		massCreateStories(storiesToCreate, done);
	});

	it('Can get the created stories with GET recent query', function(done){
		chai.request(server).get(`/api/story/recent/?count=${storiesToCreate}`).end(function(error, response){
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body).to.exist;

			expect(response.body).to.have.property('error', null);
			expect(response.body).to.have.property('story');

			expect(response.body.story).to.be.an.instanceOf(Array);
			expect(response.body.story).to.have.lengthOf(storiesToCreate);

			expect(response.body.story).to.have.deep.members(createdStories);

			done();
		});
	});

	it('Can get random stories with GET random query', function(done){
		chai.request(server).get(`/api/story/random/?count=${storiesToCreate}`).end(function(error, response){
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body).to.exist;

			expect(response.body).to.have.property('error', null);
			expect(response.body).to.have.property('story');

			expect(response.body.story).to.be.an.instanceOf(Array);
			done();
		});
	});

	it('Can get user stories with of "anonymous" user whose id is -1 ', function(done){
		chai.request(server).get(`/api/story/user/?id=-1&count=${storiesToCreate}`).end(function(error, response){
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body).to.exist;

			expect(response.body).to.have.property('error', null);
			expect(response.body).to.have.property('story');

			expect(response.body.story).to.be.an.instanceOf(Array);
			expect(response.body.story).to.have.lengthOf.at.least(storiesToCreate);
			done();
		});
	});
});
