import React from 'react';
import PropTypes from 'prop-types';

class LoadingIndicator extends React.Component {
	constructor(properties)
	{
		super(properties);
	}
	
	render()
	{
		let className = 'loading-indicator';
		if(this.props.small)
		{
			className += ' loading-indicator-small';
		}
		
		return (
			<div className={className}/>
		);
	}
}

LoadingIndicator.propTypes = {
	small: PropTypes.bool
}



export default LoadingIndicator;




