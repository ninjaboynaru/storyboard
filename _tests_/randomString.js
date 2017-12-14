

function randomString(stringSize=10, spaces=false) {
	let charRange = 'ABCDEFGHIJKLMNOPQRSTUVQXYZabcdefghijklmnopqrstuvwxyz0123456789';
	if(spaces == true)
	{
		charRange += '      ';	
	}
	
	charRange = charRange.split('');
	let text = '';

	for (let i = 0; i < stringSize; i++)
	{
		text += charRange[Math.floor(Math.random() * charRange.length)];
	}
	return text;
}



module.exports = randomString;





