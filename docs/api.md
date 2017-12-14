

## StoryBoard API
The Story Board API enables clients to create, and retrieve stories from the database. The API is intended only to be used by the StoryBoard website.  
> NOTE  
In all the examples below, replace **api/** with the URL of the API.  
Usually something like http://heroku.myStoryBoardApp.com/api


#### Endpoints
- **POST** api/create
- **GET** api/story/?title= **OR** api/story/?id=
- **GET** api/story/random/?count=
- **GET** api/story/recent/?count=
- **GET** api/story/user/?id=&count=

#### GET api/story/?
Retrieve a story based on its id or title. 
  
**USAGE EXAMPLES**
- Find a story whose title is "Story Title"
	- api/story/?title=Story%20Title
- Find a story by its id
	- api/story/?id=123445569

#### GET api/story/random/?count=&fields=
Retrieve an array of random stories whose size is based on the **count** query. Due to how the random stories are retrieved, the amount of stories retrieved my be slightly more or less than the specified **count** query. Thus, sometimes if the **count** query is to low, such as **count=2**, 0 stories may be returned.
  
**USAGE EXAMPLES**
- Get 12 random stories
	- api/story/random/?count=12
Get 2 random stories
	- api/story/random/?count=2

#### GET api/story/recent/?count=&fields=
Retrieve an array of recent stories. Same usage as **api/story/random** except that this request is assured to return the an amount of stories specified in the **count** query unless the **count** query is larger than the amount of stories in the database.

#### GET api/story/user/?id=&count=&fields=
Retrieve an array of stories belonging to a user. The **count** query determines how many stories are returned.  
The **id** query parameter is the database _id of the user and is also the users google accounts' userId;

#### POST api/create
Create a story.  
The requests' content-type header must be **application/json**.  
The requests' body must be a valid JSON object matching the following
```javascript
{
  "title": "my stories title",
  "author": "my stories author",
  "body": "the story itself",
  "idToken": "google OAuth2 ID token or -1"
}
```
- "idToken" can be set to -1 to post a story anonymously


#### The *count* parameter
Any API endpoint using the **count** query parameter fallows the same rules for count.
- There is a maximum allowed count
- If the count parameter is larger than the maximum, count is set to the maximum
- If the count parameter is less than or equal to 0, count is set to the maximum


#### The *fields* parameter
The **fields** query parameter specifies which fields to include on the returned story object.  
It is a comma delimited string of field names.  
- The *id* and *user* fields will always be returned.
  
**USAGE EXAMPLE**
- Get 10 random stories, only return the *title* and *author* field for each story
	- api/story/random/?count=10&fields=title,author

### API Response Object
The API response object will match the following.
```javascript
{
	error: {
		error: "title of the error",
		description: "general description of the error",
		httpCode: 404,
		message: "more specific description of the error. May be null",
		errorCode: 15 //server defined error code for specific error
	},
	story: {
		title:"1984",
		author:"Sir George Orwell",
		body:"Pls don't actually post the entire book.",
		user: {
			id:-1.
			name:"anonymous"
		}
	}

}
```
If no error occurred, **error** will be null.  
**author** may be null as the **author** field is not a mandatory field for creating a story.



