function DragonCurveBox(){

    var args = Array.prototype.slice.call( arguments),

        /**
         * Callback function to be executed;
         *
         * @private
         * @property
         * @type {Function}
         */
        callback = args.pop() ,

        /**
         * List of dependencies to be initialized before callback execution;
         */
        modules = ( args[0] && typeof args[0] === "string" ) ? args : args[0],

        m;

    /* Verifying whether the function has been called as a constructor */
    if ( ! (this instanceof DragonCurveBox) ){
        return new DragonCurveBox( modules , callback );
    }

    /* If modules are not specified, then have to add them to base 'this' object; */
    if ( !modules || modules == "*" ){
        modules = [];

        for ( m in DragonCurveBox.modules ){
            if ( DragonCurveBox.modules.hasOwnProperty( m ) ){
                modules.push( m );
            }
        }
    }

    /* Initializing modules */
    for ( m = 0 ; m < modules.length ; m++ ){
        DragonCurveBox.modules[ modules[ m ] ]( this );
    }

    callback( this );
}

DragonCurveBox.prototype = {
    name : "Dragon curve global constructor",
    version : "1.0"
};

/**
 * List of modules;
 *
 * @static
 * @type {{}}
 */
DragonCurveBox.modules = {};