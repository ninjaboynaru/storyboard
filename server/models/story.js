const mongoose = require('mongoose');
const inputValidation = require('../../config/inputValidation.json');

const storySchema = new mongoose.Schema(
	{
		title: { type: String, required: true, minlength: inputValidation.title.minLength, maxlength: inputValidation.title.maxLength },
		body: { type: String, required: true, minlength: inputValidation.body.minLength, maxlength: inputValidation.body.maxLength },
		author: { type: String,	minlength: inputValidation.author.minLength, maxLength: inputValidation.author.maxlength },
		user: { type: String, ref:'User' }
	},
	{ versionKey: false }
);

const Story = mongoose.model('Story', storySchema);


module.exports = Story;


