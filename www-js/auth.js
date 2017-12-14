import googleClientId from '../config/googleClientId.json';


/**
* Light wrapper for googles' auth2 API.
* The base google API must be loaded through a script tag.
* <script src='https://apis.google.com/js/platform.js'></script>
*
* More info - https://developers.google.com/identity/sign-in/web/devconsole-project
*/
const auth = new function()
{
	const _self = this;
	const _clientId = googleClientId.clientId;
	let _gapi;
	let _auth2;
	let _authStateListeners = [];

	function _invokeAuthStateListeners()
	{
		let signedInUser = _self.getUser();
		_authStateListeners.forEach(function(listener){
			listener(signedInUser);
		});
	}

	/**
	* @function
	* Initialize the auth library.
	* If the DOM is not already loaded, this function will wait for the DOM to load before initializing.
	* 
	* @returns {promise} promise - Resolved when the library is initialized or rejected with an error.
	* The resolved value is the auth object itself.
	*/
	this.init = function()
	{
		if(document.readyState == 'loading')
		{
			return new Promise(function(resolve, reject) {
				document.addEventListener('DOMContentLoaded', function(){
					_self.init().then(resolve, reject);
				});
			});
		}
		else if(window.gapi == null)
		{
			let errorMessage = 'Global gapi object is undefined or null. ';
			errorMessage += 'Make sure the google JavaScript platform library has been loaded through a script tag.';
			return Promise.reject(errorMessage);
		}
		else
		{
			_gapi = window.gapi;
		}


		return new Promise(function(resolve, reject){
			_gapi.load('auth2', {timeout:8000, callback:onAuth2Loaded, onerror:onAuth2Error, ontimeout:onAuth2Error});

			function onAuth2Loaded()
			{
				_gapi.auth2.init({client_id:_clientId}).then(onAuth2Init, onAuth2Error);
			}

			function onAuth2Init()
			{
				_auth2 = _gapi.auth2.getAuthInstance();
				_auth2.isSignedIn.listen(_invokeAuthStateListeners);

				if(_auth2.isSignedIn.get() )
				{
					_invokeAuthStateListeners();
				}

				resolve(_self);
			}

			function onAuth2Error(error)
			{
				console.log('Error initializing google auth2', error);
				reject(error);
			}

		});
	}

	/**
	* @function
	* Return the current user object.
	* The returned value is an object containing a google users' basic profile object properties.
	*
	* If no user is signed in, null is returned
	*
	* @returns {object} basicProfile
	* @property basicProfile.id
	* @property basicProfile.name
	* @property basicProfile.givenName
	* @property basicProfile.familyName
	* @property basicProfile.profileImage - URL to the users profile image
	* 
	* More info - https://developers.google.com/identity/sign-in/web/reference#googleusergetbasicprofile
	*/
	this.getUser = function()
	{
		if(_self.isSignedIn() == true )
		{
			const basicProfile = _auth2.currentUser.get().getBasicProfile();
			const user = {
				id:basicProfile.getId(),
				name:basicProfile.getName(),
				givenName:basicProfile.getGivenName(),
				familyName:basicProfile.getFamilyName(),
				profileImage:basicProfile.getImageUrl()
				//email:basicProfile.getEmail
			};

			return user;
		}
		else
		{
			return null;
		}
	}

	/**
	* @function
	* Return information about the current users auth session.
	* The returned object is a gapi.auth2.AuthResponse object.
	*
	* If no user is signed in, null is returned
	*
	* More info at -- https://developers.google.com/identity/sign-in/web/reference#gapiauth2authresponse
	*/
	this.getUserAuthSession = function()
	{
		if(_self.isSignedIn() == false)
		{
			return null;
		}
		else
		{
			const currentUser = _auth2.currentUser.get();
			return currentUser.getAuthResponse();
		}
	}


	this.getIdToken = function()
	{
		if(_self.isSignedIn() == false)
		{
			return -1;
		}
		else
		{
			const currentUser = _auth2.currentUser.get();
			return currentUser.getAuthResponse().id_token;
		}	
	}

	this.isSignedIn = function()
	{
		if(_auth2)
		{
			return _auth2.isSignedIn.get();
		}
		else
		{
			return false;
		}
	}

	/**
	* @function
	* Request the user to sign in.
	* The auth library will be initialized first if it has not already been initialized. i.e. auth.init()
	* 
	* @returns {promise} - Promise that resolves when the user is signed in or rejects if the user could not be signed in.
	* There are many reasons the promise may reject.
	* - Error initializing
	* - Login popup window was blocked
	* - Login popup was closed by the user
	* - Older browsers my have issues with the popup
	*/
	this.signIn = function()
	{
		if(_auth2 == null)
		{
			return _self.init().then(function(){
				return _auth2.signIn();
			});
		}
		else
		{
			return _auth2.signIn();
		}
	}

	/**
	* @function
	* Sign out the currently signed in user.
	* The auth library will be initialized first if it has not already been initialized. i.e. auth.init()
	* 
	* @returns {promise} - Promise that resolves when the user is signed out.
	*/
	this.signOut = function()
	{
		if(_auth2 == null)
		{
			return _self.init().then(function(){
				return _auth2.signOut();
			});
		}
		else
		{
			return _auth2.signOut();
		}
	}

	/**
	* @function
	* Add a listener function to be invoked when the a user logs in or out.
	* The function will be called with the signed in user or null as its parameter. 
	*/
	this.addAuthStateListener = function(listenerFn)
	{
		if(typeof listenerFn == 'function')
		{
			_authStateListeners.push(listenerFn);
		}
	}

	this.removeAuthStateListener = function(listenerFn)
	{
		if(typeof listenerFn == 'function')
		{
			const listenerIndex = _authStateListeners.indexOf(listenerFn);
			if(listenerIndex > -1)
			{
				_authStateListeners.splice(listenerIndex, 1);
			}
		}
	}
}



export default auth;





