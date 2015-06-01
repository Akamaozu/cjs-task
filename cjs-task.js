// TASK MANAGER

module.exports = TaskManager;

var noticeboard = require('cjs-noticeboard');

function TaskManager(callback){

  var task, 
    register_order,
    current_step,
    task_order,
    store,
    log,
    api;

    task = new noticeboard({logging: false});
    register_order = [];
    current_step = 0;
    store = {};
    log = [];
    api = {};

    if(!callback){ callback = function(){} }
    if(typeof callback !== 'function'){ throw new Error('TASK CALLBACK MUST BE A FUNCTION'); }

  // DEFINE API
    api.step = function(name, step){

      if(!name){ throw new Error('TASKS CAN\'T HAVE UNNAMED STEPS'); }
      if(!step || typeof step !== "function"){ throw new Error('TASK STEPS ARE FUNCTIONS'); }

      task.once(name, 'task-manager', step);
      register_order.push( name );
    }

    api.order = function(task_list){

      if(Object.prototype.toString.call(task_list) !== '[object Array]'){ 

        throw new Error('GIVEN TASK ORDER IS NOT AN ARRAY'); 
      }

      task_order = task_list;
    }

    api.start = function(){

      if(!task_order){ task_order = register_order; }

      task.notify( task_order[current_step] );
    }

    api.next = function(){

      if( current_step >= (task_order.length - 1) ){ return; }

          current_step += 1;
          task.notify( task_order[ current_step ] );
    }

    api.end = function(){
      
      callback.apply(callback, arguments);

      store = null;
      task = null;
      log = null;
      api = null;
    }

    api.unset = function(key){

      if(typeof key === 'undefined'){ return; }

      delete store[key];
    }

    api.set = function(key, value){

      if(!key){ throw new Error('NEED A KEY TO STORE DATA'); }

      store[key] = value;
    }

    api.get = function(key){

      return (typeof store[key] !== 'undefined' ? store[key] : null);
    }

    api.log = function(entry){

      if(typeof entry !== "undefined"){

        log.push(entry);
      }

      else {

        return log;
      }
    }

  return api;
}