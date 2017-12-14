const path = require('path');
const express = require('express');

const staticFilesPath = path.join(__dirname, '../../www');
const indexHtmlPath = path.join(staticFilesPath, '/html/index.html');
const notFoundHTMLPath = path.join(staticFilesPath, '/html/404.html');

const staticFilesRoute = express.Router();

staticFilesRoute.use(express.static(staticFilesPath) );
staticFilesRoute.get(['/', '/index', '/index.html', '/submit', '/account', '/story/:key'], function(request, response){
	response.sendFile(indexHtmlPath);
});

staticFilesRoute.notFound404Handler = function(request, response)
{
	response.sendFile(notFoundHTMLPath);
}


module.exports = staticFilesRoute;
