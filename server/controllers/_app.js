const express = require('express');
const staticFilesRoute = require('./staticFilesRoute.js');
const apiCreateRoute = require('./apiCreateRoute.js');
const apiStoryRoute = require('./apiStoryRoute.js');
const apiRandomRoute = require('./apiRandomRoute.js');
const apiRecentRoute = require('./apiRecentRoute.js');
const apiUserRoute = require('./apiUserRoute.js');

const appRouter = express.Router();
appRouter.use('/', [staticFilesRoute, apiCreateRoute, apiStoryRoute, apiRandomRoute, apiRecentRoute, apiUserRoute] );
appRouter.get('*', staticFilesRoute.notFound404Handler);

module.exports = appRouter;
