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

describe('Task Instance Behavior', function(){

	describe('task.start', function(){

		it('executes the first step', function(done){

			var started = false;
			var task = cjs_task();

			task.step('step 1', function(){

				started = true;
			});

			task.start();

			setTimeout(function(){

				done();

				assert.equal(started === true, true, 'first step did not execute');

			}, 50);
		});
	})

	describe('task.step', function(){

		it('adds a process to be executed when task starts', function(done){

			var step_added = false;
			var task = cjs_task();

			task.step('pass done to task callback', function(){

				step_added = true;

				done();

				assert.equal(step_added === true, true, 'step was not added');
			});

			task.start();
		});

		it('executes next step on task.next()', function(done){

			var progressed_to_next_step = false;
			var task = cjs_task();

			task.step('step 1', task.next);

			task.step('step 2', function(){

				progressed_to_next_step = true;

				done();

				assert.equal(progressed_to_next_step === true, true, 'did not progress to the next step');
			});

			task.start();
		});

		it('does not execute next step without task.next()', function(done){

			var steps_executed = {1: false, 2: false};
			var task = cjs_task();

			task.step('step 1', function(){

				steps_executed[1] = true;
			});

			task.step('step 2', function(){

				steps_executed[2] = true;
			});

			task.start();

			setTimeout(function(){

				done();

				assert.equal(steps_executed[1] === true, true, 'step 1 was not executed');
				assert.equal(steps_executed[2] === false, true, 'step 2 was executed without task.next()');
			}, 50);
		});

		it('executes steps sequentially', function(done){

			var expected = ['test', 'is', 'running'];
			var outcome = [];
			var task = cjs_task();

			task.step('step 1', function(){

				outcome.push( expected[0] );
				task.next();
			});

			task.step('step 2', function(){

				outcome.push( expected[1] );
				task.next();
			});

			task.step('step 3', function(){

				outcome.push( expected[2] );
			});

			task.start();

			setTimeout(function(){

				done();

				assert.equal(expected[0] === outcome[0] && expected[1] === outcome[1] && expected[2] === outcome[2], true, 'steps were not executed sequentially');
			}, 50);
		});
	});

	describe('task.end', function(){

		it('triggers instance callback', function(done){

			var callback_triggered = false;

			var task = cjs_task(function(){

				callback_triggered = true;

				done();

				assert.equal(callback_triggered === true, true, 'callback was not triggered');
			});

			task.step('step 1', function(){

				task.end();
			});

			task.start();
		});
	});

	describe('task.get', function(){

		it('retrieves value assigned to a key by task.set', function(){

			var set_value = 'hello world';
			var get_value;
			var key = 'testing';

			var task = cjs_task();

			task.set( key , set_value);

			get_value = task.get( key );

			assert.equal(set_value === get_value, true, 'retrieved value does not match set value');
		});
	});

	describe('task.unset', function(){

		it('deletes value assigned to a key by task.set', function(){

			var set_value = 'hello world';
			var get_value;
			var key = 'testing';

			var task = cjs_task();

			task.set( key , set_value);

			task.unset( key );

			get_value = task.get( key );

			assert.equal(get_value === null, true, 'set value was not deleted');
		});
	});
});