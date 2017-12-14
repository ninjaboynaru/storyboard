import React from 'react';
import LoadingIndicator from '../components/loadingIndicator.jsx';
import storyBoardApi from '../storyBoardApi.js';
import buildUserErrorMessage from '../buildUserErrorMessage.js';




/**
* Display a story.
* Must be rendered within a router and in a url with the fallowing parameter /:storyId
*/
class Story extends React.Component {
	constructor(properties)
	{
		super(properties);
		this.state = ({story:null, userErrorMessage:null});

		this.onApiResponse = this.onApiResponse.bind(this);
	}

	componentDidMount()
	{
		if(this.props.match == null)
		{
			throw new ReferenceError('StoryPage component rendered outside of a router. props.match property is undefined');
		}
		else if(this.props.match.params.storyId == null)
		{
			let fatalErrorMessage = 'StoryPage componend rendered in a route without a storyId match property. ';
			fatalErrorMessage += 'props.match.storyId is undefined';
			throw new ReferenceError(fatalErrorMessage);
		}
		else
		{
			let storyId = this.props.match.params.storyId;
			storyBoardApi.getStory({id:storyId}, this.onApiResponse);
		}
	}

	render()
	{
		let uiToRender;
		if(this.state.userErrorMessage)
		{
			uiToRender = <p className='error-message'>{this.state.userErrorMessage}</p>
		}
		else if(this.state.story == null)
		{
			uiToRender = <LoadingIndicator/>
		}
		else
		{
			let authorText = null;
			if(this.state.story.author)
			{
				authorText = 'Author: ' + this.state.story.author;
			}
			
			uiToRender = (
				<div className='story'>
					<p className='story__title'>{this.state.story.title}</p>
					<p className='story__author'>Posted by: {this.state.story.user.name}</p>
					<p className='story__author'>{authorText}</p>
					<p className='story__body'>{this.state.story.body}</p>
				</div>
			);
		}


		return uiToRender;
	}


	onApiResponse(error, story, networkError)
	{
		if(error || networkError)
		{
			let userErrorMessage = buildUserErrorMessage(error, networkError);
			this.setState({userErrorMessage:userErrorMessage});
		}
		else if(story == null)
		{
			let userErrorMessage = "Sorry, we could not find the story you're looking for";
			this.setState({userErrorMessage:userErrorMessage});
		}
		else
		{
			this.setState({story:story});
		}
	}
}



export default Story;

