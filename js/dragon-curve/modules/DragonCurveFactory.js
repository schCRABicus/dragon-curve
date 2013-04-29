/**
 * DragonCurveFactory is a module to create dragon curve instances;
 *
 * @param box Reference to global constructor;
 * @constructor DragonCurveFactory
 */
DragonCurveBox.modules.DragonCurveFactory = function( box ){

    /**
     * Creates an instance of dragon curve object;
     *
     * @param o {Object} A set of options;
     * @returns {DragonCurve}
     */
    box.createDragonCurveInstance = function( o ){
        var instance = new DragonCurve();
        instance.init( o );

        return instance;
    };

    /**
     * @class DragonCurve
     * @constructor
     */
    function DragonCurve( ){

        var
            /**
             * An array of vertexes the dragon curve consists of at the moment;
             *
             * @private
             * @property _vertexes
             * @type {Array}
             */
            _vertexes = [],

            /**
             * List of the vertexes being under construction;
             * These vertexes define a branch being rotated at the moment;
             * As soon as the branch stops changing ( rotated by 90 degrees ),
             * these vertexes become static and are added to _vertexes array;
             *
             * @private
             * @property _constructed_vertexes
             * @type {Array}
             */
            _constructed_vertexes = [],

            /**
             * Current origin the new branch is being rotated around at the moment;
             *
             * @private
             * @property _current_origin
             * @type {{x: number, y: number}}
             */
            _current_origin = { x : 0 , y : 0 },

            /**
             * Current set of options;
             *
             * @private
             * @property _current_options
             * @type {Array}
             */
            _current_options = {},

            /**
             * Current drawing options, containing line color, line width, etc.
             *
             * @private
             * @property _drawing_options
             * @type {Object}
             */
            _drawing_options = {},

            _coords = {
                max : {
                    x : 0,
                    y : 0
                },
                min : {
                    x : 10000,
                    y : 10000
                }
            },

            /**
             * Caches transformation values;
             *
             * @private
             * @property _cached_transforms
             * @type {{ sin : Object , cos : Object }}
             */
            _transform_cache = { sin : {} , cos : {} };


        /**
         * Initializes Dragon Curve object;
         * Sets initial vertexes and origin : if no vertexes where specified in options,
         * then adds default {0,0} and {0,1} pair;
         *
         * @public
         * @method init
         * @param o {Object} Initial parameters :
         *                  - strokeStyle - line color
         *                  - lineWidth   - line width
         *                  - vertexes    - a set of vertexes to start the drawing from;
         */
        this.init = function( o ){
            var i, l;

            _current_options = $.extend( {}, DragonCurve.default_options , o );
            _drawing_options = {
                color : _current_options.color,
                width : _current_options.width,
                fill : _current_options.fill
            };

            if ( !_current_options.hasOwnProperty("vertexes")){
                _current_options.vertexes = [
                    { x : 0 , y : 0 },
                    { x : 0 , y : 1 }
                ];
            }

            for ( i = 0 , l =_current_options.vertexes.length ; i < l; i++ ){
                this.addVertex( _current_options.vertexes[i] );
            }

            _current_origin = _vertexes[ _vertexes.length - 1 ];
        };

        /**
         * Returns a list of current vertexes;
         *
         * @public
         * @method getVertexes
         * @return {Array}
         */
        this.getVertexes = function(){
            return _vertexes;
        };

        /**
         * Adds new vertex;
         *
         * @public
         * @method addVertex
         * @param v {Object} Vertex to be added;
         */
        this.addVertex = function( v ){
            _vertexes.push( v );
            this.setOrigin( v );
        };

        /**
         * Returns a list of currently constructed vertexes;
         *
         * @public
         * @method getConstructedVertexes
         * @return {Array}
         */
        this.getConstructedVertexes = function(){
            return _constructed_vertexes;
        };

        /**
         * Gets current origin;
         *
         * @public
         * @method getOrigin
         * @return {{x: number, y: number}}
         */
        this.getOrigin = function(){
            return _current_origin;
        };

        /**
         * Returns the starting point of the curve;
         *
         * @return {*}
         */
        this.getStartingPoint = function(){
            return _vertexes && _vertexes.length ? _vertexes[0] : { x : 0 , y : 0 };
        };

        /**
         * Sets current origin;
         *
         * @public
         * @method setOrigin
         * @param o {{x: number, y: number}} Origin to be set;
         */
        this.setOrigin = function( o ){
            _current_origin = o;
        };

        /**
         * Gets a list of drawing options;
         *
         * @return {{}}
         */
        this.getDrawingOptions = function(){
            return _drawing_options;
        };

        /**
         * Gets current maximum coordinates;
         *
         * @public
         * @method getMaxCoords
         * @return {*}
         */
        this.getMaxCoords = function(){
            return _coords.max;
        };

        /**
         * Gets current minimum coordinates;
         *
         * @public
         * @method getMinCoords
         * @return {*}
         */
        this.getMinCoords = function(){
            return _coords.min;
        };

        /**
         * This method doesn't perform physical rotation, it just calculates the coordinates of the rotated points
         * and fills _constructed_vertexes array;
         *
         * The coordinates of the rotated point with respect to the original point are calculated in the following way :
         *
         *    xx = ox + ( x - ox ) * cos( a ) - ( y - oy ) * sin( a );
         *    yy = oy + ( x - ox ) * sin( a ) + ( y - oy ) * cos( a );
         *
         * where a is an angle, {x,y} - original point, {xx,yy} - rotated one, {ox, oy} - current origin;
         *
         * @public
         * @method calculateRotatedPoints
         * @param a {Number} The angle current branch to be rotated;
         */
        this.calculateRotatedPoints = function( a ){
            var cv = _constructed_vertexes = [],
                o = this.getOrigin(),
                vx = this.getVertexes(),
                p = { x : 0 , y : 0 },
                t , v , i , l = vx.length - 1 ;

            if ( !_transform_cache.sin.hasOwnProperty( a ) ){
                _transform_cache.sin[ a ] = Math.sin( a * Math.PI / 180 );
            }
            if ( !_transform_cache.cos.hasOwnProperty( a ) ){
                _transform_cache.cos[ a ] = Math.cos( a * Math.PI / 180 );
            }

            /* calculating coefficients and storing them */
            t = {
                sin : _transform_cache.sin[ a ],
                cos : _transform_cache.cos[ a ]
            };

            for ( i = l; i >= 0 ; i-- ){
                v = vx[i];
                p.x = o.x + ( v.x - o.x ) * t.cos - ( v.y - o.y ) * t.sin;
                p.y = o.y + ( v.x - o.x ) * t.sin + ( v.y - o.y ) * t.cos;
                cv.push({
                    x : p.x,
                    y : p.y
                });
            }

        };

        /**
         * Clears all vertexes to free the memory;
         */
        this.clear = function(){
            _vertexes = _constructed_vertexes = null;
        };

    }

    /**
     * Static property that stores default curve options;
     * List of default options which are to be extended by 'o' object;
     *
     * @static
     * @type {{color: string, fill: string, width: number}}
     */
    DragonCurve.default_options = {
        color : "#000",
        fill : "none",
        width : 1
    };

};