var noticeboard = require('cjs-noticeboard');

module.exports = TaskManager;

function TaskManager(callback){

  var task = new noticeboard({logging: false}),
      current_step = 0,
      task_order = [],
      store = {},
      log = [],
      api = {},
      started;

  if(!callback){ callback = function(){} }
  if(typeof callback !== 'function'){ throw new Error('TASK CALLBACK MUST BE A FUNCTION'); }
  
  // break task down into individual steps
    api.step = create_task_step;
  
  // control flow
    api.start = start_task;
    api.next = run_next_task_step;
    api.end = end_task;

  // configuration
    api.get = get_task_variable;
    api.set = set_task_variable;
    api.unset = delete_task_varable;
    api.callback = set_task_callback;

  // logging
    api.log = function( entry ){
      if(entry) create_task_log_entry(entry);
      else return get_task_log();
    };

  return api;
  
  function set_task_callback(end_callback){

    if(!end_callback) return;
    if(typeof end_callback !== 'function'){ throw new Error('TASK CALLBACK MUST BE A FUNCTION'); }

    callback = end_callback;
  }

  function create_task_step(name, step){

    if(!name){ throw new Error('TASKS CAN\'T HAVE UNNAMED STEPS'); }
    if(typeof name !== 'string'){ throw new Error('STEP NAMES MUST BE STRINGS'); }
    if(!step || typeof step !== "function"){ throw new Error('TASK STEPS ARE FUNCTIONS'); }

    task.once(name, 'task-manager', step);
    task_order.push( name );
  }

  function start_task(){

    if( started ) throw new Error('TASK HAS ALREADY STARTED');

    started = true;
    task.notify( task_order[current_step] );
  }

  function run_next_task_step(){

    if( current_step < (task_order.length - 1) ){ 

      current_step += 1;
      task.notify( task_order[ current_step ] );
    }

    else api.end();
  }

  function end_task(){
    
    callback.apply(callback, arguments);

    store = task = log = api = null;
  }

  function delete_task_varable(key){

    if(!key){ throw new Error('NEED A KEY TO DELETE DATA'); }
    if(typeof key !== 'string'){ throw new Error('KEY MUST BE A STRING'); }

    delete store[key];
  }

  function set_task_variable(key, value){

    if(!key){ throw new Error('NEED A KEY TO STORE DATA'); }
    if(typeof value === 'undefined'){ throw new Error('NEED A VALUE TO STORE'); }
    if(typeof key !== 'string'){ throw new Error('KEY MUST BE A STRING'); }

    store[key] = value;
  }

  function get_task_variable(key){

    if(!key){ throw new Error('NEED A KEY TO RETRIEVE DATA'); }
    if(typeof key !== 'string'){ throw new Error('KEY MUST BE A STRING'); }

    return (typeof store[key] !== 'undefined' ? store[key] : null);
  }

  function create_task_log_entry(entry){
    if(typeof entry !== "undefined") log.push(entry);
  }

  function get_task_log(){
    return log;
  }
}