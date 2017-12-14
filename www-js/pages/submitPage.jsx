import React from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../components/textInput.jsx';
import auth from '../auth.js';
import storyBoarApi from '../storyBoardApi.js';
import buildUserErrorMessage from '../buildUserErrorMessage.js';
import inputValidation from '../../config/inputValidation.json';



/**
* Allows a user to create a story and submit it.
*/
class Submit extends React.Component {
	constructor(properties)
	{
		super(properties);
		this.state = {signedIn:false, titleErrorMessage:null, authorErrorMessage:null, bodyErrorMessage:null, authWarningMessage:null, titleText:'', authorText:'', bodyText:'', storyHref:''}

		this.submitStory = this.submitStory.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onAuthorChange = this.onAuthorChange.bind(this);
		this.onBodyChange = this.onBodyChange.bind(this);
		this.onAuthStateChange = this.onAuthStateChange.bind(this);
		this.onApiResponse = this.onApiResponse.bind(this);


		this._defaultAuthWarning = 'You are not signed in. Your story will be posted anonymously.';
		if(auth.isSignedIn() == false)
		{
			this.state.authWarningMessage = this._defaultAuthWarning;
		}
	}


	componentDidMount()
	{
		auth.addAuthStateListener(this.onAuthStateChange);
	}

	render() {
		let uiToRender;

		if(this.state.storyHref)
		{
			/** Display a link to the users created story */
			uiToRender = (
				<div className='submit'>
					<Link to={this.state.storyHref} className='submit__link'>Your Story Link</Link>
				</div>
			);
		}
		else
		{
			uiToRender = (
				<div className='submit'>
					<p className='submit__error'>{this.state.titleErrorMessage}</p>
					<TextInput onChange={this.onTitleChange} placeholder='...Title' className='submit__title' autoComplete='off' autoCapitalize='none' />

					<p className='submit__error'>{this.state.authorErrorMessage}</p>
					<TextInput onChange={this.onAuthorChange} placeholder='...Author' className='submit__author' autoComplete='off' autoCapitalize='none' />

					<p className='submit__error'>{this.state.bodyErrorMessage}</p>
					<TextInput textarea onChange={this.onBodyChange} placeholder='...Your story' className='submit__body'/>


					<p className='submit__error'>{this.state.authWarningMessage}</p>
					<button onClick={this.submitStory} className='submit__send-btn'>Submit</button>
				</div>
			);
		}

		return uiToRender
	}

	componentWillUnmount()
	{
		auth.removeAuthStateListener(this.onAuthStateChange);
	}


	onTitleChange(titleText)
	{
		let validationError = this.validateTitle(titleText);
		this.setState({titleText:titleText, titleErrorMessage:validationError});
	}
	onAuthorChange(authorText)
	{
		let validationError = this.validateAuthor(authorText);
		this.setState({authorText:authorText, authorErrorMessage:validationError});
	}
	onBodyChange(bodyText)
	{
		let validationError = this.validateBody(bodyText);
		this.setState({bodyText:bodyText, bodyErrorMessage:validationError});
	}

	submitStory()
	{
		if(this.state.titleErrorMessage || this.state.authorErrorMessage || this.state.bodyErrorMessage)
		{
			return;
		}
		else if(this.state.titleText == '' || this.state.authorText == '' || this.state.bodyText == '')
		{
			return;
		}
		else
		{
			let idToken = auth.getIdToken();
			storyBoarApi.createStory(this.state.titleText, this.state.authorText, this.state.bodyText, idToken, this.onApiResponse);
		}
	}

	onAuthStateChange(user)
	{
		if(user)
		{
			this.setState({signedIn:true, authWarningMessage:null});
		}
		else
		{
			this.setState({signedIn:false, authWarningMessage:this._defaultAuthWarning});
		}
	}

	onApiResponse(error, story, networkError)
	{
		if(error || networkError)
		{
			let userErrorMessage;

			// custom error code defined by the server
			if(error && error.errorCode == 15)
			{
				userErrorMessage = 'Either the title, author, or body is too long or too short. Please check them and try again';
			}
			else
			{
				userErrorMessage = buildUserErrorMessage(error, networkError);
			}

			this.setState({bodyErrorMessage:userErrorMessage});
		}
		else
		{
			let href = `/story/${story.id}`;
			this.setState({ storyHref:href });
		}
	}

	
	/**
	* @function
	* Validate the contents of a title text.
	* Will return null if no issues were found, or will return an user targeted error message detailing the problem.
	*/
	validateTitle(title)
	{
		let validationMessage = null;

		if(title.trim().length < inputValidation.title.minLength)
		{
			validationMessage = `* The title is too short. The title must be at least ${inputValidation.title.minLength} characters`;
		}
		else if(title.trim().length > inputValidation.title.maxLength)
		{
			validationMessage = `* The title is too long. The maximum length is ${inputValidation.title.maxLength} characters`;
			validationMessage += `\r\nIt is currently ${title.trim().length} characters long`
		}

		return validationMessage;
	}

	/**
	* @function
	* Validate the contents of a author text.
	* Will return null if no issues were found, or will return an user targeted error message detailing the problem.
	*/
	validateAuthor(author)
	{
		let validationMessage = null;

		if(author.trim().length < inputValidation.author.minLength)
		{
			validationMessage = `* The authors' name is too short. The author must be at least ${inputValidation.author.minLength} characters`;
		}
		else if(author.trim().length > inputValidation.author.maxLength)
		{
			validationMessage = `* The author is too long. The maximum length is ${inputValidation.title.maxLength} characters`;
			validationMessage += `\r\nIt is currently ${author.trim().length} characters long`
		}

		return validationMessage;
	}

	/**
	* @function
	* Validate the contents of a body text.
	* Will return null if no issues were found, or will return a user targeted error message detailing the problem.
	*/
	validateBody(body)
	{
		let validationMessage = null;

		if(body.trim().length < inputValidation.body.minLength)
		{
			validationMessage = `* The story body is too short. The body must be at least ${inputValidation.body.minLength} characters.`;
		}
		else if(body.trim().length > inputValidation.body.maxLength)
		{
			validationMessage = `* The story body is too long. The maximum length is ${inputValidation.body.maxLength} characters.`;
			validationMessage += `\r\nIt is currently ${body.trim().length} characters long`
		}

		return validationMessage;
	}

}





export default Submit;


