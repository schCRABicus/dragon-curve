/**
 * Validation module;
 *
 * @param box Reference to global constructor;
 * @constructor
 */
DragonCurveBox.modules.Validator = function( box ){

    /**
     * Sets configuration object to validator;
     *
     * @public
     * @method setValidationConfig
     * @param config {Object} Current configuration to be taken into account during validation;
     */
    box.setValidationConfig = function( config ){
        validator.config = config;
    };

    /**
     * Validates the specified data with respect to the last specified config;
     * Returns an array of errors;
     *
     * @param data {Object} Data to be validated;
     * @returns {*} An array of errors;
     */
    box.validate = function( data ){
        return validator.validate( data );
    };

    /**
     * Gets the last validation messages;
     *
     * @public
     * @method getValidationErrors
     * @return {Array|messages}
     */
    box.getValidationErrors = function(){
        return validator.getErrors;
    };

    /**
     * Static property providing currently available types;
     *
     * @static
     * @type {{}}
     */
    box.types = {
        "isNormalContainerSize" : "isNormalContainerSize",
        "isNormalCoordinate" : "isNormalCoordinate",
        "isNormalSegment" : "isNormalSegment",
        "isNormalSegmentLength" : "isNormalSegmentLength"
    };


    /**
     * Validator object;
     *
     * @type {{messages: Array, config: {}, types: {}, validate: Function, getErrors: Function}}
     */
    var validator = {

        /**
         * List of messages in the current validation;
         *
         * @private
         * @property
         * @type {Array}
         */
        messages : [],

        /**
         * Current validation config;
         *
         * @private
         * @property
         * @type {{}}
         */
        config : {},

        /**
         * A set of validation rules;
         *
         * @public
         * @property
         * @type {{}}
         */
        types : {},

        /**
         * Validates the specified data;
         *
         * @public
         * @method validate
         * @param data {{}} Data to be validated; A map { key -> value };
         * @return {Array|messages}
         */
        validate : function( data ){

            var k , msg, strategy, validator, res;

            this.messages = [];

            for ( k in data ){
                if ( data.hasOwnProperty( k ) ){

                    strategy = this.config[ k ];
                    validator = this.types[ strategy ];

                    if ( !strategy ){
                        continue;
                    }
                    if ( !validator ){
                        throw new Error(" validator.validate : no handler to validate strategy " + strategy);
                    }

                    res = validator.validate( data[k] );
                    if ( !res ){
                        msg = "Invalid value for *" + k + "*, " + validator.instructions;
                        this.messages.push( msg );
                    }
                }
            }

            return this.getErrors();
        },

        /**
         * Gets the last validation messages;
         *
         * @public
         * @method getErrors
         * @return {Array|messages}
         */
        getErrors : function(){
            return this.messages;
        }
    };

    /**
     * Validation rule to check whether the given number is an appropriate container dimension value;
     *
     * @type {{_min_value: number, _max_value: number, validate: Function}}
     */
    validator.types.isNormalContainerSize = {

        _min_value : 100,
        _max_value : 100000,

        validate : function( v ){
            v = Number( v );

            return (v >= this._min_value && v <= this._max_value);
        },

        instructions : "the value must be between 100 and 100000."
    };

    validator.types.isNormalCoordinate = {

        _min_value : 100,
        _max_value : 3000,

        validate : function( v ){
            v = Number( v );

            return (v >= this._min_value && v <= this._max_value);
        },

        instructions : "the value must be between 100 and 3000. Otherwise the curve will not be visible."
    };

    /**
     * Rule to check whether the segment is not empty or not a single dot;
     *
     * @type {{validate: Function}}
     */
    validator.types.isNormalSegment = {

        validate : function( v ){
            var sx = v.start ? v.start.x : null,
                sy = v.start ? v.start.y : null,
                ex = v.end ? v.end.x : null,
                ey = v.end ? v.end.y : null,
                dx = sx != null && ex != null ? Math.abs( ex - sx ) : null,
                dy = sy != null && ey != null ? Math.abs( ey - sy ) : null;

            return !!( dx || dy );
        },

        instructions: "the segment can't be a single point."
    };

    /**
     * Rule to check whether the segment length is valid;
     *
     * @type {{validate: Function}}
     */
    validator.types.isNormalSegmentLength = {

        validate : function( v ){
            return v && v > 0;
        },

        instructions: "the segment length must be positive."
    };

};