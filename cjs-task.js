var noticeboard = require('cjs-noticeboard');

module.exports = TaskManager;

function TaskManager(callback){

  var task = new noticeboard({logging: false}),
      current_step = 0,
      task_order = [],
      store = {},
      log = [],
      api = {};

  if(!callback){ callback = function(){} }
  if(typeof callback !== 'function'){ throw new Error('TASK CALLBACK MUST BE A FUNCTION'); }

  // DEFINE API
    api.callback = function(end_callback){

      if(!end_callback) return;
      if(typeof end_callback !== 'function'){ throw new Error('TASK CALLBACK MUST BE A FUNCTION'); }

      callback = end_callback;
    }

    api.step = function(name, step){

      if(!name){ throw new Error('TASKS CAN\'T HAVE UNNAMED STEPS'); }
      if(typeof name !== 'string'){ throw new Error('STEP NAMES MUST BE STRINGS'); }
      if(!step || typeof step !== "function"){ throw new Error('TASK STEPS ARE FUNCTIONS'); }

      task.once(name, 'task-manager', step);
      task_order.push( name );
    }

    api.start = function(){

      if( started ) throw new Error('TASK HAS ALREADY STARTED');

      started = true;
      task.notify( task_order[current_step] );
    }

    api.next = function(){

      if( current_step < (task_order.length - 1) ){ 

        current_step += 1;
        task.notify( task_order[ current_step ] );
      }

      else api.end();
    }

    api.end = function(){
      
      callback.apply(callback, arguments);

      store = null;
      task = null;
      log = null;
      api = null;
    }

    api.unset = function(key){

      if(!key){ throw new Error('NEED A KEY TO DELETE DATA'); }
      if(typeof key !== 'string'){ throw new Error('KEY MUST BE A STRING'); }

      delete store[key];
    }

    api.set = function(key, value){

      if(!key){ throw new Error('NEED A KEY TO STORE DATA'); }
      if(typeof value === 'undefined'){ throw new Error('NEED A VALUE TO STORE'); }
      if(typeof key !== 'string'){ throw new Error('KEY MUST BE A STRING'); }

      store[key] = value;
    }

    api.get = function(key){

      if(!key){ throw new Error('NEED A KEY TO RETRIEVE DATA'); }
      if(typeof key !== 'string'){ throw new Error('KEY MUST BE A STRING'); }

      return (typeof store[key] !== 'undefined' ? store[key] : null);
    }

    api.log = function(entry){

      if(typeof entry !== "undefined") log.push(entry);
      else return log;
    }

  return api;
}