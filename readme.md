# CJS-TASK #
---

## Simplify Your Javascript with CJS-Task ##

**Without CJS-Task**

```js
	// Render Data from API
	
	get_data_from_api('http://sour.ce/api/data', function(err, data){	  
	  if(err){ return callback(err); }
	  
	  var modified_data = do_something_synchronous( data );

	  async_process( modified_data, function(err, formatted_data){
	    if(err){ return callback(err); }

	    render_data( formatted_data, function(){
	      console.log('rendered formatted data from api');
	      callback(null, formatted_data);
	    });
	  });
	});
```

**With CJS-Task**

```js
	// Render Data from API

	var task = require('cjs-task')(function(err, formatted_data){
	  if(err){ return callback(err) }

	  console.log('rendered formatted data from api');
	  callback(null, formatted_data);
	});

	task.step('get data from api', function(){	  
	  get_data_from_api('http://sour.ce/api/data', function(err, data){
		if(err){ return task.end(err); }

 		task.set('modified-data', do_something_synchronous( data ));
	    task.next();
	  });
	});

	task.step('process modified data asynchronously', function(){
	  async_process( task.get('modified-data'), function(err, formatted_data){
	    if(err){ return task.end(err); }

	    task.set('formatted-data', formatted_data);
	    task.next();
	  });
	});

	task.step('render formatted data', function(){
	  render_data( task.get('formatted-data'), function(){
	    task.end(null, task.get('formatted-data'));
	  });
	});

	task.start();
```	

**Why is the CJS-Task Snippet Preferrable?**

1. Easier to understand your intent
2. Easier to add / modify the process
3. Easier to make different  libraries interoperable
4. Mix procedural code, callbacks, promises and generators effortlessly

## Installation ##
	npm install --save cjs-task

## Create a Task Instance ##

	var task = require('cjs-task')( callback );

* **returns an object**
* **callback must be a function** 

## Task Instance API ##

### task.step( name, process ) ###
Adds a function to be executed before triggering the task callback.

* **Is a Function**
* **Parameters**
	* **name**
		* is a string
		* is required
		* is a unique identifier for this step
	* **process**
		* is a function
		* is required
		* must call task.next() to proceed to the next step
* **Notes**
	* instance will not progress to the next step until `task.next()` is called within step callback
	* steps are executed the order they are created

### task.next() ###
Signals the completion of a `task.step` process and triggers the next step, if any.

* **Is a Function**
* **Notes**
	* used to control the flow of a task
	* ideally should be used in a `task.step` procedure

### task.start() ###
Begins the process of executing task steps.

* **Is a Function**
* **Notes**
	* use AFTER setting up all task steps

### task.end() ###
Passes its arguments to task callback and executes it.

* **Is a Function**
* **Notes**
	* `task.end` will drop all steps and stored data after task callback is executed

### task.set( key, value ) ###
Put anything into task instance's key-value store. 

* **Is a Function**
* **Parameters**
	* **key**
		* is a string
		* is required
	* **value**
		* any type accepted
* **Notes**
	* Automatically emptied `task.end` will drop all steps and stored data after task callback is executed

### task.get( key ) ###
Retrieve data from task instance's key-value store. 

* **Is a Function**
* **Parameters**
	* **key**
		* is a string
		* is required

### task.unset( key ) ###
Remove data from task instance's key-value store. 

* **Is a Function**
* **Parameters**
	* **key**
		* is a string
		* is required