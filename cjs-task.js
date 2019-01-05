var _yield = require('cjs-yield');

module.exports = create_task;

function create_task( callback ){
  var current_step = 0,
      step_order = [],
      store = {},
      log = [],
      api = {},
      steps_run = 0,
      steps_deleted = 0,
      insertions = 0,
      started;

  if( ! callback ) callback = default_task_callback;
  if( typeof callback !== 'function' ) throw new Error( 'TASK CALLBACK MUST BE A FUNCTION' );

  // control flow
    api.start = start_task;
    api.step = create_task_step;
    api.next = start_next_task_step;
    api.end = end_task;

  // configuration
    api.get = get_task_variable;
    api.set = set_task_variable;
    api.unset = delete_task_varable;
    api.callback = set_task_callback;

  // stats
    api.stats = {
      steps_run: function(){ return steps_run },
      steps_deleted: function(){ return steps_deleted }
    };

  // logging
    api.log = function( entry ){
      if( entry ) create_task_log_entry( entry );
      else return get_task_log();
    };

  return api;

  function set_task_callback( end_callback ){
    if( typeof end_callback !== 'function' ) throw new Error( 'TASK CALLBACK MUST BE A FUNCTION' );
    else callback = end_callback;
  }

  function create_task_step( name, step ){
    if( ! name ) throw new Error( 'TASKS CAN\'T HAVE UNNAMED STEPS' );
    if( typeof name !== 'string' ) throw new Error( 'STEP NAMES MUST BE STRINGS' );
    if( ! step || typeof step !== 'function' ) throw new Error( 'TASK STEPS ARE FUNCTIONS' );

    if( ! started ) step_order.push({ name: name, step: step });
    else {
      step_order.splice( current_step + 1 + insertions, 0, { name: name, step: step });
      insertions += 1;
    }
  }

  function start_task(){
    if( started ) throw new Error( 'TASK HAS ALREADY STARTED' );
    if( step_order.length < 1 ) throw new Error( 'TASK HAS NO STEPS TO RUN' );

    started = true;
    run_step();
  }

  function start_next_task_step(){
    if( ! started ) throw new Error( 'CAN\'T CALL NEXT STEP BEFORE TASK STARTS' );

    steps_run += 1;

    // remove completed step
      step_order.shift();
      steps_deleted += 1;

    // reset step insertion tracker
      insertions = 0;

    // end task if no more steps remain
      var should_end_task = step_order.length === 0;
      if( should_end_task ) return end_task();

    // else run next step
      run_step();
  }

  function run_step(){

    _yield( function(){
      try {
        step_order[ current_step ].step();
      }
      catch( error ){
        end_task( error );
      }
    });
  }

  function end_task(){
    if( ! started ) throw new Error( 'CAN\'T CALL NEXT STEP BEFORE TASK STARTS' );

    callback.apply( callback, arguments );
    store = log = api = null;
  }

  function delete_task_varable( key ){
    if( ! key ) throw new Error( 'NEED A KEY TO DELETE DATA' );
    if( typeof key !== 'string' ) throw new Error( 'KEY MUST BE A STRING' );

    delete store[ key ];
  }

  function set_task_variable( key, value ){
    if( ! key ) throw new Error( 'NEED A KEY TO STORE DATA' );
    if( typeof key !== 'string' ) throw new Error( 'KEY MUST BE A STRING' );
    if( typeof value === 'undefined' ) throw new Error( 'NEED A VALUE TO STORE' );

    store[ key ] = value;
  }

  function get_task_variable( key ){
    if( ! key ) throw new Error( 'NEED A KEY TO RETRIEVE DATA' );
    if( typeof key !== 'string' ) throw new Error( 'KEY MUST BE A STRING' );

    return ( typeof store[ key ] !== 'undefined' ? store[ key ] : null );
  }

  function create_task_log_entry( entry ){
    log.push( entry );
  }

  function get_task_log(){
    return log;
  }

  function default_task_callback( error ){
    if( error && error instanceof Error ) throw error;
  }
}