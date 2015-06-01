# CJS-TASK #
---

## Simplify Your Javascript with CJS-Task ##

**What your Javascript Probably Looks Like**

    // CREATE NEW USER
    if(!username || !password || !email){
      callback(error);
    }
    
    check_db_if_username_exists(username, function(err, username_exists){    
      
      if(err || username_exists){ return callback(err); }
        
      check_db_if_email_exists(email, function(err, email_exists){    
      
        if(err || email_exists){ return callback(err); }
        
        bcrypt(password, salt, function(err, password_hash){    
    
          if(err){ return callback(err); }
    
          var create_user_querystring = "'INSERT INTO `user` (username, email, passhash) VALUES ("' + username +'", "' + email +'", "'+ password_hash +'")'";
    
          mysql.query( create_user_querystring, function(err, result){

            if(err || !result){ return callback(err); }
            
            callback(null, { user_id: result.insertId });    
          });
        });
      });      
    });

**What Your Javascript Looks Like with CJS-Task**

    
    if(!username || !password || !email){
      callback(error);
    }

	var task = require('cjs-task')(function(error, user_id){
      if(error){ return callback(error); }
	  callback(null, { user_id: user_id });
	});
    
	task.set('username', username);
    task.set('password', password);
    task.set('email', email);

	task.step('verify unique username', function(){

	  check_db_if_username_exists( task.get('username'), function(err, username_exists){		
		if(err || username_exists){ return task.end(err); }
	    task.next();
	  });
	});

	task.step('verify unique email', function(){

	  check_db_if_email_exists( task.get('email'), function(err, email_exists){		
		if(err || email_exists){ return task.end(err); }
	    task.next();
	  });
	});

	task.step('salt and hash password', function(){	
	
	  bcrypt( task.get('password'), salt, function(err, password_hash){		
		if(err || !password_hash){ return task.end(err); }	    
	    task.set('passhash', password_hash);
	    task.next();
	  });
	});

	task.step('create db record', function(){	
	  var create_user_querystring = "'INSERT INTO `user` (username, email, passhash) VALUES ("' + task.get('username') +'", "' + task.get('email') +'", "'+ task.get('passhash') +'")'";
    
      mysql.query( create_user_querystring, function(err, result){
        if(err || !result){ return task.end(err); }
	    task.set('user-id', result.insertId);            
        task.next();    
      });
	});

	task.step('confirm user creation', function(){
	  task.end(null, task.get('user-id'));
	});

	task.start(); 

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