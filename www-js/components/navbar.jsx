import React from 'react'
import { Link } from 'react-router-dom';
import LoginButton from './loginButton.jsx';
import PropTypes from 'prop-types';
import sitelinks from '../../config/sitelinks.json';


/**
* Dual desktop and mobile navigation in one.
* Both desktop and mobile navs are rendered at the same time.
* It's up to the CSS to hide and show the appropriate one.
*/
class Navbar extends React.Component {
	constructor(properties)
	{
		super(properties);
		this.state = {mobileNavActive:false};
		this.toggleMobileNav = this.toggleMobileNav.bind(this);
		this.closeMobileNav = this.closeMobileNav.bind(this);
	}

	componentDidMount()
	{
		if(this.props.passCloseNavFunction)
		{
			/** Pass a function to close the navigation, back to the parent*/
			this.props.passCloseNavFunction(this.closeMobileNav);
		}
	}

	render()
	{
		let links = sitelinks.navigation.map(function(link, index){
			return (
				<Link to={link.path} className='nav__btn' key={link.path+index} onClick={this.closeMobileNav}>
					{link.text}
				</Link>
			);
		}, this);
		links.push(<LoginButton key='LoginButton' onClick={this.closeMobileNav}/>);

		let desktopNav
		let mobileNav;
		let mobileNavToggle;
		let mobileNavCSS = 'nav nav--small';

		if(this.state.mobileNavActive == true)
		{
			/** mobile nav should be hidden by CSS by default*/
			mobileNavCSS += ' nav--small--show';
		}

		desktopNav = (
			<div className='nav nav--large'>
				{links}
			</div>
		);

		mobileNav = (
			<div className={mobileNavCSS}>
				{links}
			</div>
		);

		mobileNavToggle = (
			<button className='nav__toggle-icon icon-menu' onClick={this.toggleMobileNav}/>
		);


		return (
			<nav className='nav-wrapper'>
				{desktopNav}
				{mobileNavToggle}
				{mobileNav}
			</nav>
		);
	}


	toggleMobileNav()
	{
		this.setState({mobileNavActive: !this.state.mobileNavActive});
	}
	closeMobileNav()
	{
		if(this.state.mobileNavActive == true)
		{
			this.setState({mobileNavActive: false});
		}
	}
}

Navbar.propTypes = {
	passCloseNavFunction: PropTypes.func
}



export default Navbar;




