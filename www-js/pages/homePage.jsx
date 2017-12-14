import React from 'react';
import StoryTab from '../components/storyTab.jsx';
import LoadingIndicator from '../components/loadingIndicator.jsx';
import storyBoardApi from '../storyBoardApi.js';
import buildUserErrorMessage from '../buildUserErrorMessage.js';


/**
* Display a wall of random stories
*/
class Home extends React.Component {
	constructor(properties) {
		super(properties);
		this.state = {stories:null, userErrorMessage:null}
		
		this.onApiResponse = this.onApiResponse.bind(this);
	}
	
	render() {
		if(this.state.userErrorMessage)
		{
			return <div className='error-message'>{this.state.userErrorMessage}</div>;
		}
		else if(this.state.stories == null)
		{
			return <LoadingIndicator/>;
		}
		else if(this.state.stories.length == 0)
		{
			return <div className='error-message'>No stories were found. Comback later, or submit one.</div>;
		}
		else
		{
			let storiesUi = [];
			this.state.stories.forEach(function(currentStory, currentIndex){
				const key = currentStory.title + currentIndex;
				storiesUi.push(<StoryTab storyTitle={currentStory.title} storyId={currentStory.id} key={key}/>);
			});
			
			return <div className='story-array'>{storiesUi}</div>
		}
	}
	
	componentDidMount()
	{
		if(this.state.stories == null)
		{
			storyBoardApi.getRandomStories(20, {fields:['title']}, this.onApiResponse);
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
			this.setState({stories:stories});
		}
	}
}


export default Home;










