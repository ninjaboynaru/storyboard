const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		_id: {type: String, required: true},
		name: { type: String, required: true }
	},
	{ versionKey: false }
);

userSchema.statics.getDefaultUserInfo = function()
{
	return {
		id:-1,
		name: 'anonymous'
	}
}

const User = mongoose.model('User', userSchema);

module.exports = User;
