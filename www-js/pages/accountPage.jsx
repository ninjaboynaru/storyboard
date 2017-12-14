import React from 'react';
import StoryTab from '../components/storyTab.jsx';
import LoadingIndicator from '../components/loadingIndicator.jsx';
import auth from '../auth.js';
import storyBoardApi from '../storyBoardApi.js';
import buildUserErrorMessage from '../buildUserErrorMessage.js';


/**
* Display all stories written by a user
*/
class Account extends React.Component {
	constructor(properties) {
		super(properties);
		this.state = {signedIn:false, userStories:null, userErrorMessage:null}

		this.onAuthStateChange = this.onAuthStateChange.bind(this);
		this.onApiResponse = this.onApiResponse.bind(this);


		if(auth.isSignedIn() == true)
		{
			this.state.signedIn = true;
		}
	}

	componentDidMount()
	{
		auth.addAuthStateListener(this.onAuthStateChange);
		if(this.state.signedIn == true)
		{
			this.requestUserStories();
		}

	}

	render() {
		let uiToRender;

		if(this.state.userErrorMessage)
		{
			uiToRender = <p className='error-message'>{this.state.userErrorMessage}</p>
		}
		else if(this.state.signedIn == false)
		{
			uiToRender = <p className='error-message'>Please log in to view your profile</p>
		}
		else if(this.state.userStories == null)
		{
			uiToRender = <LoadingIndicator/>;
		}
		else if(this.state.userStories.length == 0)
		{
			return <div className='error-message'>You haven't written any stories</div>;
		}
		else
		{
			let storiesUi = [];
			this.state.userStories.forEach(function(currentStory, currentIndex){
				const key = currentStory.title + currentIndex;
				storiesUi.push(<StoryTab storyTitle={currentStory.title} storyId={currentStory.id} key={key}/>);
			});

			uiToRender = <div className='story-array'>{storiesUi}</div>
		}

		return (
			<div>
				<p className='account__title'>Your stories</p>
				{uiToRender}
			</div>
		);
	}

	componentWillUnmount()
	{
		auth.removeAuthStateListener(this.onAuthStateChange);
	}

	requestUserStories()
	{
		let userId = auth.getUser().id;
		storyBoardApi.getUserStories(userId, 20, {fields:['title']}, this.onApiResponse);
	}

	onAuthStateChange(user)
	{
		if(user)
		{
			this.requestUserStories();
			this.setState({signedIn:true});
		}
		else
		{
			this.setState({signedIn:false});
		}

	}

	onApiResponse(error, stories, networkError)
	{		
		if(error || networkError)
		{
			let userErrorMessage = buildUserErrorMessage(error, networkError);
			this.setState({userErrorMessage:userErrorMessage});
		}
		else
		{
			this.setState({userStories:stories});
		}
	}

}




export default Account;





