var _yield = require('cjs-yield'),
    create_hooks_instance = require('cjs-sync-hooks');

module.exports = create_task;

function create_task( callback ){
  var hook = create_hooks_instance(),
      step_order = [],
      store = {},
      log = [],
      api = {},
      current_step = 0,
      insertions = 0,
      steps_run = 0,
      steps_deleted = 0,
      started;

  if( ! callback ) callback = default_task_callback;
  if( typeof callback !== 'function' ) throw new Error( 'TASK CALLBACK MUST BE A FUNCTION' );

  // control flow
    api.start = start_task;
    api.step = create_task_step;
    api.next = start_next_task_step;
    api.end = end_task;
    api.subtask = create_subtask;

  // configuration
    api.get = get_task_variable;
    api.set = set_task_variable;
    api.unset = delete_task_varable;
    api.callback = set_task_callback;

  // pluggable
    api.hook = hook;

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
    if( ! step || typeof step !== 'function' ) throw new Error( 'TASK STEPS MUST BE FUNCTIONS' );

    if( ! started ) step_order.push({ name: name, step: step });
    else {
      step_order.splice( current_step + 1 + insertions, 0, { name: name, step: step });
      insertions += 1;
    }

    hook.run( 'step-created', name );
  }

  function start_task(){
    if( started ) throw new Error( 'TASK HAS ALREADY STARTED' );
    if( step_order.length < 1 ) throw new Error( 'TASK HAS NO STEPS TO RUN' );

    started = true;
    hook.run( 'task-start' );

    run_step();
  }

  function start_next_task_step(){
    if( ! started ) throw new Error( 'CAN\'T CALL NEXT STEP BEFORE TASK STARTS' );

    steps_run += 1;

    // remove completed step
      var completed_step = step_order.shift();
      steps_deleted += 1;

    // reset step insertion tracker
      insertions = 0;

    hook.run( 'step-end', completed_step.name );

    // end task if no more steps remain
      var should_end_task = step_order.length === 0;
      if( should_end_task ) return end_task();

    // else run next step
      run_step();
  }

  function run_step(){

    _yield( function(){
      hook.run( 'step-start' );

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

    var end_task_args = arguments;

    _yield( function(){
      hook.run( 'task-end' );

      callback.apply( callback, end_task_args );

      store = log = api = null;
    });
  }

  function create_subtask( name, handler ){
    if( ! name ) throw new Error( 'SUBTASKS CAN\'T BE UNNAMED' );
    if( typeof name !== 'string' ) throw new Error( 'SUBTASK NAMES MUST BE STRINGS' );
    if( ! handler || typeof handler !== 'function' ) throw new Error( 'SUBTASK HANDLERS MUST BE FUNCTIONS' );

    create_task_step( name, function(){
      var subtask = create_task();

      // copy store from task to subtask
        for( var key in store ){
          if( ! store.hasOwnProperty( key ) ) continue;
          else subtask.set( key, store[ key ] );
        }

      // copy store changes in subtask to task
        subtask.hook.add( 'value-updated', 'copy-changes-to-main-task', function( details ){
          set_task_variable( details.key, details.value );
        });

      handler( subtask );
    });
  }

  function delete_task_varable( key ){
    if( ! key ) throw new Error( 'NEED A KEY TO DELETE DATA' );
    if( typeof key !== 'string' ) throw new Error( 'KEY MUST BE A STRING' );

    delete store[ key ];

    hook.run( 'value-updated', { key: key, value: null });
  }

  function set_task_variable( key, value ){
    if( ! key ) throw new Error( 'NEED A KEY TO STORE DATA' );
    if( typeof key !== 'string' ) throw new Error( 'KEY MUST BE A STRING' );
    if( typeof value === 'undefined' ) throw new Error( 'NEED A VALUE TO STORE' );

    store[ key ] = value;

    hook.run( 'value-updated', { key: key, value: value });
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