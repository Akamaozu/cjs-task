var assert = require('assert');
var cjs_task = require('../cjs-task.js');
var expected_api = ['callback', 'step', 'start', 'next', 'end', 'unset', 'set', 'get', 'log'];
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

	it('if arguments are given, throws error if first argument is not a function', function(){

		var error_thrown = false;

		try {

			var task = cjs_task( [] );
		}

		catch( e ){

			if( e instanceof Error ) error_thrown = true;
		}

		assert.equal( error_thrown === true, true, 'did not throw an error ')
	});
});

describe('Task Instance API', function(){


	var task = cjs_task();

	describe('task.callback', function(){

		it('is a function', function(){

			assert.equal(typeof task.callback === 'function', true, 'task.callback is not a function');
		});
		it('requires a function as first argument', function(){

			var requires_function = false;

			try{

				task.callback([]);
			}

			catch(err){

				requires_function = true;
			}
		
			assert.equal(requires_function, true, 'first argument does not need to be a function');
		});
	});

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
		});

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

			catch(error){

				requires_string = true;
			}

			assert.equal(requires_string, true, 'first argument does not need to be a string');
		});
	});

	describe('task.log', function(){

		it('is a function', function(){

			assert.equal(typeof task.log === 'function', true, 'task.log is not a function');
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

		it('throws an error if called multiple times', function(done){

			var task = cjs_task(),
					error_thrown = false;

			task.step('test multiple starts', function(){

				try{

					task.start();
				}

				catch(error){

					error_thrown = true;
				}

				done();
				
				assert.equal(error_thrown === true, true, 'error was not thrown when start was called multiple times');
			});

			task.start();
		});

		it('throws an error if there are no steps to run', function(){

			var task = cjs_task(),
					error_thrown = false;

			try{
				task.start();
			}

			catch(e){
				error_thrown = true;
			}

			assert.equal(error_thrown, true, 'error not thrown');
		});
	});

	describe('task.step', function(){

		it('function executes when task.start() is called', function(done){

			var step_added = false;
			var task = cjs_task();

			task.step('testing add a step', function(){

				step_added = true;

				done();

				assert.equal(step_added === true, true, 'step was not added');
			});

			task.start();
		});

		it('extra steps do not execute without task.next()', function(done){

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
	});

	describe('task.next', function(){

		it('executes next step after task has started', function(done){

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

		it('executes task callback if there are no more steps', function(done){

			var triggered_callback = false;
			var task = cjs_task( function(){

				triggered_callback = true;

				done();

				assert.equal(triggered_callback === true, true, 'did not trigger callback after last step');
			});

			task.step('step 1', task.next);
			task.step('step 2', task.next);

			task.start();
		});

		it('will throw an error if called before task starts', function(){

			var task = cjs_task(),
					threw_error = false;

			task.step('step 1', task.next);

			try{
				task.next();
			}

			catch(e){
				threw_error = true;
			}

			assert.equal(threw_error, true, 'did not throw error');
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

		it('will throw an error if called before task starts', function(){

			var task = cjs_task(),
					threw_error = false;

			task.step('step 1', task.next);

			try{
				task.end();
			}

			catch(e){
				threw_error = true;
			}

			assert.equal(threw_error, true, 'did not throw error');
		});
	});

	describe('task.callback', function(){
	
		it('overwrites previous task callback', function(){

			var default_callback = false;
			var modified_callback = false;

			var task = cjs_task(function(){
				default_callback = true;
				do_assertions();
			});

			task.step('step 1', task.next);

			task.callback(function(){
				modified_callback = true;
				do_assertions();
			});

			task.start();

			function do_assertions(){
				assert(default_callback === false, true, 'default callback was triggered');
				assert(modified_callback === true, true, 'modified callback was not triggered');
			}
		});
	});

	describe('task.set', function(){

		it('throws an error if no key is given', function(){

			var task = cjs_task(),
					value = 'test',
					error_thrown = false;

			try{

				task.set( null, value );
			}

			catch(error){

				error_thrown = true;
			}

			assert.equal(error_thrown === true, true, 'no error thrown when no key is given');
		});

		it('throws an error if key is not a string', function(){

			var task = cjs_task(),
					value = 'test',
					error_thrown = false;

			try{

				task.set( [], value );
			}

			catch(error){

				error_thrown = true;
			}

			assert.equal(error_thrown === true, true, 'no error thrown when key is not a string');
		});

		it('throws an error if called with no value to store', function(){

			var task = cjs_task(),
					key = 'test',
					error_thrown = false;

			try{

				task.set( key );
			}

			catch(error){

				error_thrown = true;
			}

			assert.equal(error_thrown === true, true, 'no error thrown when given no value to store');
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

		it('returns null if key has no stored value', function(){

			var task = cjs_task();

			assert.equal( task.get( 'test' ), null, 'did not return null');
		});

		it('throws an error if no key is given', function(){

			var task = cjs_task(),
					error_thrown = false;

			task.set('key', 'value');

			try{

				task.get();
			}

			catch(error){

				error_thrown = true;
			}

			assert.equal(error_thrown === true, true, 'no error thrown when no key is given');
		});

		it('throws an error if key is not a string', function(){

			var task = cjs_task(),
					key = 'test',
					error_thrown = false;

			task.set( key, 'hello' );

			try{

				task.get( [] );
			}

			catch(error){

				error_thrown = true;
			}

			assert.equal(error_thrown === true, true, 'no error thrown when key is not a string');
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

		it('throws an error if no key is given', function(){

			var task = cjs_task(),
					error_thrown = false;

			task.set('key', 'value');

			try{

				task.unset();
			}

			catch(error){

				error_thrown = true;
			}

			assert.equal(error_thrown === true, true, 'no error thrown when no key is given');
		});

		it('throws an error if key is not a string', function(){

			var task = cjs_task(),
					key = 'test',
					error_thrown = false;

			task.set( key, 'hello' );

			try{

				task.unset( [] );
			}

			catch(error){

				error_thrown = true;
			}

			assert.equal(error_thrown === true, true, 'no error thrown when key is not a string');
		});
	});

	describe('task.log', function(){

		it('returns array of stored arguments if no argument is given', function(){

			var task = cjs_task(),
					log_entries;

			log_entries = task.log();

			assert.equal( Object.prototype.toString.call( log_entries ) === '[object Array]', true, 'did not return an array' );
			assert.equal( log_entries.length === 0, true, 'task log should be empty, but isn\'t' );
		});

		it('stores first argument given', function(){

			var task = cjs_task(),
					entries_to_log = [1, [], {}, function(){}],
					log_entries;

			entries_to_log.forEach( function( entry ){

				task.log( entry );
			});

			log_entries = task.log();

			log_entries.forEach( function( entry, index ){

				assert.equal( entry === entries_to_log[ index ], true, 'entry at index ' + index + ' does not match input');
			});
		});
	});
});