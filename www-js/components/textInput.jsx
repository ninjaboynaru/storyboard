import React from 'react';
import PropTypes from 'prop-types';

/**
* Generic text input component with the option to be a <textarea> HTML component
*/
class TextInput extends React.Component {
	constructor(properties)
	{
		super(properties);
		this.state = {value:''};

		this.onInputChange = this.onInputChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}

	render()
	{
		let uiToRender;

		if(this.props.textarea)
		{
			/** Passing in a "textarea" property to a textarea element will cause react to throw an error. Thus, remove it*/
			const textareaProps = Object.assign({}, this.props);
			delete textareaProps.textarea;
			
			uiToRender = <textarea value={this.state.value} {...textareaProps} onKeyPress={this.onKeyPress} onChange={this.onInputChange}/>
		}
		else
		{
			uiToRender = <input type='text' value={this.state.value} {...this.props} onChange={this.onInputChange} onKeyPress={this.onKeyPress}/>
		}

		return uiToRender;

	}


	onInputChange(event)
	{
		this.setState({value: event.target.value});

		if(this.props.onChange && typeof this.props.onChange == 'function')
		{
			this.props.onChange(event.target.value);
		}
	}

	onKeyPress(event)
	{
		if(this.props.onKeyPress && typeof this.props.onKeyPress == 'function')
		{
			const enterKeyPressed = (event.key == 'Enter');
			this.props.onKeyPress(event.key, enterKeyPressed);
		}
	}

}

TextInput.propTypes = {
	// if set, renders the text input as a <textarea> HTML component
	textarea: PropTypes.bool,

	className: PropTypes.string,
	placeholder: PropTypes.string,

	// callback called when the input changes. Is passed the input text as a parameter
	onChange: PropTypes.func,

	// callback called when a key is pressed on the input. Is passed the key pressed as a string
	onKeyPress: PropTypes.func
}


export default TextInput;






