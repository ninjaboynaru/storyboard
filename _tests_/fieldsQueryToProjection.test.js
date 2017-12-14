const chai = require('chai');
const expect = chai.expect;
const toProjection = require('../server/utils/fieldsQueryToProjection.js');




it('Returns correct projection object', function(){
	expect(toProjection('title,body') ).to.deep.equal( {title:1, body:1} );
	expect(toProjection('title, body,   ,,author') ).to.deep.equal( {title:1, body:1, author:1} );
	
	expect(toProjection('field') ).to.deep.equal( {field:1} );
	expect(toProjection('') ).to.not.exist;
	expect(toProjection('         ') ).to.not.exist;
});





