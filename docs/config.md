


## Server Config Files
Configuration files are stored in the [config](../config) folder and are used by both the front end and the back end.

***

#### errorEnum.json
Various error messages pertaining to a specific error that may have occurred on the server side. The JSON objects in this file are meant to be passed to the error building methods within [**responseBuilder.errorBuilder**](../server/responseBuilder.js)  
> "errorCode" is a server defined error code to allow clients to pinpoint exactly what went wrong.

***

#### inputValidation.json
Defines required input lengths for database models and their fields.

***

#### mongoConfig.json
Contains 3 different mongodb URIs to be used in different env types.
- Production
- Development
- Testing  

Create it in the following format
```javascript
{
  "productionUri":"uri to production database",
  "developmentUri":"uri to development databse",
  "testingUri":"uri to testing database"	
}
```

This file must be added to the **.gitignore**. Because of this, it may not exist within your copy. You must create it yourself and use your own database URIs.


In a Heroku runtime environment, this file will not exist due to **.gitignore**, thus the following Heroku env variables should be defined and used as a backup.  
- MONGO_PROD_URI
- MONGO_DEV_URI

***

#### googleClientId.json
Contains the google client id (like an API key) for your app.  Is used by both the front end and the back end.  
Create it in the allowing format
```javascript
{
  "clientId":"your applications' client id"
}
```





