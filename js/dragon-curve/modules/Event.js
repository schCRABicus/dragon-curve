/**
 * Event module;
 * Implements simple 'observer' pattern;
 *
 * @param box Reference to global constructor;
 * @constructor
 */
DragonCurveBox.modules.Event = function( box ){

    var

        _slice = Array.prototype.slice,

        /**
         * List of event listeners;
         *
         * @private
         * @property _listeners
         * @type {Object}
         */
        _listeners = {};


    /**
     * Adds listener to the specified event type;
     *
     * @public
     * @method add_listener
     * @param type {String} Event type to listen to;
     * @param fn {Function} Function to execute on the specified event;
     */
    box.add_listener = function( type, fn ){
        type = type || "all";

        if ( typeof fn === "function"){
            if ( !_listeners.hasOwnProperty( type ) ){
                _listeners[ type ] = [];
            }

            _listeners[ type ].push( fn );
        }
    };

    /**
     * Informs observers of the specified event;
     *
     * @public
     * @method inform_listeners
     * @param type {String} Triggered event type
     */
    box.inform_listeners = function( type ){
        var args = _slice.call( arguments , 1),
            i , l;

        if ( _listeners.hasOwnProperty( type ) ){
            for ( i = 0 , l = _listeners[ type ].length ; i < l ; i++ ){
                _listeners[ type ][i].apply( null , args );
            }
        }
    };

    /**
     * Clears up all the listeners;
     *
     * @public
     * @method clear_listeners
     */
    box.clear_listeners = function(){
        _listeners = {};
    };
};
