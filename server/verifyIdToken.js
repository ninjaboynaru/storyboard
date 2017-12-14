let clientId;
try {
	// in a heroku runtime enviorment, this file should not exist (because it should be added to .gitignore)
	clientId = require('../config/googleClientId.json').clientId;
}
catch(e) {
	// in the heroku runtime enviorments, these env variables MUST be set
	clientId = process.env.CLIENT_ID;
	if(clientId == null)
	{
		throw new Error('no googleClientId.json file found and env variable CLIENT_ID has not been set.');
	}
}

const GoogleAuth = require('google-auth-library');
const auth = new GoogleAuth;
const authClient = new auth.OAuth2(clientId, '', '');


/**
* @function
* Verify the validity of a google idToken.
* If the token is valid the callback will be invoked with the users information payload.
* 
* @param {string} idToken
* @param {function} callback
* @callback-syntax - callback(error, userPayload)
*
* More info - https://developers.google.com/identity/sign-in/web/backend-auth
*/
function verifyIdToken(idToken, callback)
{
	authClient.verifyIdToken(idToken, clientId, function(error, userLogin){
		if(error)
		{
			callback(error, null);
		}
		else
		{
			const userInfo = userLogin.getPayload();
			callback(null, userInfo);
		}
	});
}






module.exports = verifyIdToken;

