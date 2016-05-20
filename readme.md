# CJS-TASK #
---
[![Build Status](https://travis-ci.org/Akamaozu/cjs-task.svg?branch=master)](https://travis-ci.org/Akamaozu/cjs-task)

## Control Flow Like a Pro ##

### Procedural. Callbacks. Promises. Generators. ###
### No longer matters which one any library uses. ###

1. Create a Step to use the library. 
2. Use Library.
3. Set data to the Task Instance. 
4. Go to next step. 

**It's that simple.** 

![Complex Workflows Simplified](http://designbymobi.us/wp-content/uploads/2015/07/sample-task.png)

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

### task.callback( callback ) ###
Overwrite previous task callback. 

* **Is a Function**
* **Parameters**
	* **callback**
		* is a function
		* is required

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

## LICENSE ##

The MIT License (MIT)

Copyright (c) 2015 Uzo Olisemeka <uzo@designbymobius.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.