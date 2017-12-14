const express = require('express');
const mongoose = require('mongoose');
const app = require('./controllers/_app.js');

const port = process.env.PORT || 8080;
const envType = process.env.NODE_ENV || 'production';

const server = express();
server.use('/', app);


let mongoConfig;
try {
	// in a heroku runtime enviorment, this file should not exist (because mongoConfig.json should be added to .gitignore)
	mongoConfig = require('../config/mongoConfig.json');
}
catch (e) {
	// in heroku runtime enviorments, these env variables MUST be set
	let mongoProdUri = process.env.MONGO_PROD_URI;
	let mongoDevUri = process.env.MONGO_DEV_URI;

	if (mongoProdUri == undefined || mongoDevUri == undefined)
	{
		throw new Error('no mongoConfig.json file found and env variables MONGO_PROD_URI or MONGO_DEV_URI have not been set.');
	}
	else
	{
		mongoConfig = {
			productionUri: mongoProdUri,
			developmentUri: mongoDevUri
		};
	}
}

let mongoUri;
if (envType == 'production') {
	mongoUri = mongoConfig.productionUri;
} else {
	mongoUri = mongoConfig.developmentUri;
}


mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, { useMongoClient: true }).then(OnMongooseSuccess, OnMongooseError);

function OnMongooseSuccess() {
	console.log('Conected to mongo database');
	console.log(`Enviorment type: ${envType}`);

	server.listen(port, function() {
		console.log(`Server started on port ${port}`);
	});
}

function OnMongooseError(error) {
	console.log('Failed to connect to mongo databse');
	throw new Error(error);
}
