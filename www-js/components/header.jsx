import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar.jsx';



class Header extends React.Component {
	constructor(properties) {
		super(properties);
		this.onLogoClicked = this.onLogoClicked.bind(this);
		this.receiveCloseNavFunction = this.receiveCloseNavFunction.bind(this);
	}
	
	render() {		
		return (
			<header className='header'>
				<Link to='/' className='header__logo-text' onClick={this.onLogoClicked}>StoryBoard</Link>
				<Navbar passCloseNavFunction={this.receiveCloseNavFunction}/>
			</header>
		);
	}
	
	receiveCloseNavFunction(closeNavFunction)
	{
		// receive the function to close the nav (mobile navigation only), from the Navbar child
		this.closeNav = closeNavFunction;
	}
	
	onLogoClicked()
	{
		this.closeNav();
	}
	
}



export default Header;








