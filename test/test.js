var assert = require('assert');
var cjs_task = require('../cjs-task.js');
var expected_api = ['step', 'order', 'start', 'next', 'end', 'unset', 'set', 'get', 'log'];

describe('require("cjs-task")', function(){
	
	it('is a function', function(){

		assert.equal(typeof cjs_task === 'function', true, 'is not a function');
	});

	it('returns an object when executed', function(){

		assert.equal(Object.prototype.toString.call( cjs_task() ) === '[object Object]', true, 'did not return an object');
	});

	it('returned object matches task instance api', function(){

		var returned_object = cjs_task();

		for(var i = expected_api.length - 1; i >= 0; i--) {
			
			var api_name = expected_api[i];

			assert.equal(typeof returned_object[ api_name ] !== 'undefined', true, 'returned object is missing "' + api_name + '" property');
		};
	});

	it('returned object does not have any unexpected properties', function(){

		var returned_object = cjs_task();

		for(var property in returned_object){

			assert.equal( expected_api.indexOf( property ) > -1, true, 'returned object has an unexpected property: "' + property + '"'); 
		}
	});
});