import React from 'react';
import auth from '../auth.js';



class LoginButton extends React.Component {
	constructor(properties)
	{
		super(properties);
		this.state = {signedIn:false};

		this.onLoginClick = this.onLoginClick.bind(this);
		this.onAuthStateChange = this.onAuthStateChange.bind(this);

		if(auth.isSignedIn() == true)
		{
			this.state.signedIn = true;
		}
	}

	componentDidMount()
	{
		auth.addAuthStateListener(this.onAuthStateChange);
	}

	render()
	{
		let loginText;
		let imageComponent;

		if(this.state.signedIn == false)
		{
			loginText = 'Login';

			// imageComponent background-image should be set to googles' logo by CSS
			imageComponent = <div className='login-btn__default-image'/>
		}
		else
		{
			loginText = 'Logout';
			const currentUser = auth.getUser();
			let imageUrl = currentUser.profileImage;
			let style = {backgroundImage: `url(${imageUrl})`};

			imageComponent = <div className='login-btn__image' style={style}/>
		}

		return (
			<div className='login-btn' onClick={this.onLoginClick}>
				{imageComponent}
				<p className={'login-btn__text'}>{loginText}</p>
			</div>
		);	
	}
	
	componentWillUnmount()
	{
		auth.removeAuthStateListener(this.onAuthStateChange);
	}

	onLoginClick()
	{
		if(auth.isSignedIn() == true)
		{
			auth.signOut()
		}
		else
		{
			auth.signIn().catch(function(error){
				console.log('Error signing into google', error);
			});
		}
		
		/** No need to set state.signedIn when signOut() or signIn() promises are resolved because auth.js will call onAuthStateChange() when the user signs in or out */
	}

	onAuthStateChange(newUser)
	{
		if(newUser == null)
		{
			this.setState({signedIn:false} );
		}
		else
		{
			this.setState({signedIn:true} );
		}
	}

}








export default LoginButton;


