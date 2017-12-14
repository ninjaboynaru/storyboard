import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


/**
* Small tab displaying general information about a story.
*/
class StoryTab extends React.Component {
	constructor(properties) {
		super(properties)
	}

	render() {
		return (
			<Link to={`/story/${this.props.storyId}`} className='story-tab'>
				<p className='story-tab__title'>{this.props.storyTitle}</p>
				<p className='story-tab__body'>Select to Read</p>
			</Link>
		);
	}
}


StoryTab.propTypes = {
	storyId: PropTypes.string.isRequired,
	storyTitle: PropTypes.string.isRequired
}











export default StoryTab;


