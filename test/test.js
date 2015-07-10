var assert = require('assert');
var cjs_task = require('../cjs-task.js');
var expected_api = ['step', 'order', 'start', 'next', 'end', 'unset', 'set', 'get', 'log'];
var matches_expected_api = false;

describe('require("cjs-task")', function(){
	
	it('is a function', function(){

		assert.equal(typeof cjs_task === 'function', true, 'is not a function');
	});

	it('returns an object when executed', function(){

		assert.equal(Object.prototype.toString.call( cjs_task() ) === '[object Object]', true, 'did not return an object');
	});

	it('execution returns object that matches task instance api', function(){

		var returned_object = cjs_task();

		for(var i = expected_api.length - 1; i >= 0; i--) {
			
			var api_name = expected_api[i];

			assert.equal(typeof returned_object[ api_name ] !== 'undefined', true, 'returned object is missing "' + api_name + '" property')
		};
	});

	it('execution returns object with no unexpected properties', function(){

		var returned_object = cjs_task();

		for(var property in returned_object){

			assert.equal( expected_api.indexOf( property ) > -1, true, 'found unexpected property: "' + property + '"'); 
		}
	});
});

describe('Task Instance API', function(){

	var task = cjs_task();

	describe('task.step', function(){

		it('is a function', function(){

			assert.equal(typeof task.step === 'function', true, 'task.step is not a function');
		});

		it('requires arguments', function(){

			var no_arguments_required = true;
			
			try{

				task.step();
			}

			catch(err){

				no_arguments_required = false;
			}
			
			assert.equal(no_arguments_required, false, 'arguments are not required for execution');
		});

		it('requires a string as first argument', function(){

			var requires_string = false;

			try{

				task.step({}, function(){});
			}

			catch(err){

				requires_string = true;
			}
		
			assert.equal(requires_string, true, 'first argument does not need to be a string');
		})

		it('requires a function as second argument', function(){

			var requires_function = false;

			try{

				task.step('hi', {});
			}

			catch(err){

				requires_function = true;
			}

			assert.equal(requires_function, true, 'second argument does not need to be a function');
		});
	});

	describe('task.next', function(){

		it('is a function', function(){

			assert.equal(typeof task.next === 'function', true, 'task.next is not a function');
		});
	});

	describe('task.start', function(){

		it('is a function', function(){

			assert.equal(typeof task.start === 'function', true, 'task.start is not a function');
		});
	});

	describe('task.end', function(){

		it('is a function', function(){

			assert.equal(typeof task.end === 'function', true, 'task.end is not a function');
		});
	});

	describe('task.order', function(){

		it('is a function', function(){

			assert.equal(typeof task.order === 'function', true, 'task.order is not a function');
		});
	});

	describe('task.get', function(){

		it('is a function', function(){

			assert.equal(typeof task.get === 'function', true, 'task.get is not a function');
		});

		it('requires arguments', function(){

			var requires_arguments = false

			try{ 

				task.get();
			}

			catch(err){

				requires_arguments = true;
			}
			
			assert.equal(requires_arguments, true, 'does not require arguments to execute');
		})

		it('requires a string as first argument', function(){

			var requires_string = false;

			try{

				task.get([]);
			}

			catch(err){

				requires_string = true;
			}

			assert.equal(requires_string, true, 'does not require a string argument to execute');
		});
	});

	describe('task.set', function(){

		it('is a function', function(){

			assert.equal(typeof task.set === 'function', true, 'task.set is not a function');
		});

		it('requires arguments', function(){

			var no_arguments_required = true;
			
			try{

				task.set();
			}

			catch(err){

				no_arguments_required = false;
			}
		
			assert.equal(no_arguments_required, false, 'arguments are not required for execution');
		});

		it('requires string as first argument', function(){

			var requires_string = false;

			try{

				task.set({}, function(){});
			}

			catch(err){

				requires_string = true;
			}

			assert.equal(requires_string, true, 'first argument does not need to be a string');
		});

		it('requires a second argument', function(){

			var requires_second_argument = false;

			try{

				task.set('hi');
			}

			catch(err){

				requires_second_argument = true;
			}

			assert.equal(requires_second_argument, true, 'does not require a second argument for execution');
		});
	});

	describe('task.unset', function(){

		it('is a function', function(){

			assert.equal(typeof task.unset === 'function', true, 'task.unset is not a function');
		});

		it('requires string as first argument', function(){

			var requires_string = false;

			try{

				task.unset({});
			}

			catch(err){

				requires_string = true;
			}

			assert.equal(requires_string, true, 'first argument does not need to be a string');
		});
	});
});