import React from 'react';


class ErrorBoundary extends React.Component {
	constructor(properties)
	{
		super(properties);
		this.state = {error:null};
	}
	
	componentDidCatch(error, info)
	{
		this.setState({error:error});
	}

	render()
	{
		if(this.state.error)
		{
			return (
				<div>
					<p className='error-message'>Sorry, something went wrong. Please try again later.</p>
				</div>
			);
		}
		
		else return this.props.children;
	}
	
}





export default ErrorBoundary;

