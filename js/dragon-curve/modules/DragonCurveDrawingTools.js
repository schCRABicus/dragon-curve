/**
 * A module which is responsible for dragon curves rendering;
 *
 * Depends on 'Event' and 'Commons' modules;
 *
 * @param box Reference to global constructor;
 * @constructor DragonCurveDrawingTools
 */
DragonCurveBox.modules.DragonCurveDrawingTools = function( box ){

    /**
     * Factory method to create the specified implementation of the DrawingTools interface;
     *
     * @public
     * @method
     * @param tool {String} Tool name to create;
     * @param container {Element} DOM container;
     * @return {DrawingTools}
     */
    box.createDrawingToolsInstance = function( tool , container ){
        var constr = ( tool[0] || "" ).toUpperCase() + ( tool.substring( 1 ) || "").toLowerCase(),
            drawing_tool;

        if ( typeof DrawingTools[ constr ] === "undefined" ){
            throw new Error("DrawingTools.create : Constructor of type " + constr + " doesn't exist");
        }

        if ( typeof DrawingTools[ constr ].prototype.getDragonCurves !== "function" ){
            DrawingTools[ constr ].prototype = new DrawingTools();
            DrawingTools[ constr ].prototype.constructor = DrawingTools[ constr ];
        }

        drawing_tool = new DrawingTools[ constr ]( container );
        return drawing_tool;
    };

    {
        // Simple timeout if there is no requestAnimationFrame at all;
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    }

    /**
     * Specifies a common interface for drawing tools;
     *
     * @class DrawingTools
     * @constructor
     */
    function DrawingTools(){

        var
            /**
             * An instance of dragon curve;
             *
             * @private
             * @property _dragon_curve
             * @type {Array}
             */
            _dragon_curves = [],

            /**
             * Current step;
             *
             * @private
             * @property _step
             * @type {Number}
             */
            _step = 0,

            /**
             * Maximum number of steps allowed;
             *
             * @private
             * @property _max_steps_allowed
             * @type {Number}
             */
            _max_steps_allowed = 12,

            /**
             * Property which indicates whether it's necessary to clean the dragon curves up;
             */
            _needs_cleanup = false,

            /**
             * Renderer width;
             *
             * @private
             * @property _renderer_width
             */
            _renderer_width = 10000,

            /**
             * Renderer height;
             *
             * @private
             * @property _renderer_height
             */
            _renderer_height = 10000;

        /**
         * Adds dragon curve to operate on;
         *
         * @param dragon_curve {DragonCurve} An instance of dragon curve;
         */
        this.addDragonCurve = function( dragon_curve ){

            if ( dragon_curve != null ){
                _dragon_curves.push( dragon_curve );
            }

        };

        /**
         * Returns an instance of Dragon curve;
         *
         * @public
         * @method getDragonCurves
         * @return {Array} An array of Dragon curve instances;
         */
        this.getDragonCurves = function(){
            return _dragon_curves;
        };

        /**
         * Gets current step;
         *
         * @public
         * @method getStep
         * @return {number}
         */
        this.getStep = function(){
            return _step;
        };

        /**
         * Increases current step by one;
         *
         * @public
         * @method increaseStep
         */
        this.increaseStep = function(){
            _step++;
        };

        /**
         * Sets width;
         *
         * @public
         * @method setWidth
         * @param w {Number} Width to be set;
         */
        this.setWidth = function( w ){};

        /**
         * Gets width;
         *
         * @public
         * @method getWidth
         */
        this.getWidth = function(){};

        /**
         * Sets height;
         *
         * @public
         * @method setHeight
         * @param h {Number} Height to be set;
         */
        this.setHeight = function( h ){};

        /**
         * Gets height;
         *
         * @public
         * @method getHeight
         */
        this.getHeight = function() {};

        /**
         * Gets renderer width;
         *
         * @public
         * @return {number}
         */
        this.getRendererWidth = function(){
            return _renderer_width;
        };

        /**
         * Gets renderer height;
         *
         * @public
         * @return {number}
         */
        this.getRendererHeight = function() {
            return _renderer_height;
        };

        /**
         * Sets size of the painted curves;
         *
         * @public
         * @method setSize
         * @param p {Number} Size multiplier;
         */
        this.setSize = function( p ) {};

        /**
         * Returns the maximum number of allowed steps;
         *
         * @public
         * @method getMaxStepsAllowed
         * @return {number}
         */
        this.getMaxStepsAllowed = function(){
            return _max_steps_allowed;
        };

        /**
         * Sets maximum number of steps allowed;
         *
         * @public
         * @method setMaxStepsAllowed
         * @param m {Number} New maximum number of allowed steps to be set;
         */
        this.setMaxStepsAllowed = function( m ){
            _max_steps_allowed = m;
        };

        /**
         * Sets '_needs_cleanup' property;
         *
         * @public
         * @method setNeedsCleanup
         * @param n {Boolean}
         */
        this.setNeedsCleanup = function( n ){
            _needs_cleanup = n;
        };

        /**
         * Indicates whether it's necessary to clean the dragon curves up at the moment;
         *
         * @public
         * @method needsCleanup
         * @return {boolean}
         */
        this.needsCleanup = function(){
            return _needs_cleanup;
        };

        /**
         * Resets state;
         *
         * @public
         * @method reset
         */
        this.reset = function(){
            _step = 0;
            while( _dragon_curves.length ){
                _dragon_curves.pop().clear();
            }
            box.clear_listeners();
        };

        /**
         *
         * @public
         * @method clear
         */
        this.clear = function(){
            this.reset();
        };

        /**
         * Draws the curve by the specified vertexes with animated motion effect;
         *
         * @public
         * @method drawAnimated
         * @param dcs {Array} An array of DragonCurve instances;
         * @param a {Number}  Rotate angle;
         */
        this.drawAnimated = function( dcs , a ){};

        /**
         * Draws the curve by the specified vertexes without animated motion effect;
         *
         * @public
         * @method drawNonAnimated
         * @param dcs {Array} An array of DragonCurve instances;
         */
        this.drawNonAnimated = function( dcs ){};

        /**
         * Draws initial lines and vertexes the dragon curve to be constructed on;
         *
         * @public
         * @method drawInitial
         */
        this.drawInitial = function(){};

        /**
         * Starts animated dragon curve drawing;
         *
         * @public
         * @method start
         * @param animate {Boolean} Indicates whether it's necessary to animate branches motion;
         */
        this.start = function( animate ){};

        /**
         * Event got triggered on each redraw;
         *
         * @public
         * @method onRedraw
         * @param fn {Function} Redraw event listener;
         */
        this.onRedraw = function( fn ){
            box.add_listener( "redraw" , fn );
        };

        /**
         * Event got triggered on done event;
         *
         * @public
         * @method onDone
         * @param fn {Function} Done event listener;
         */
        this.onDone = function( fn ){
            box.add_listener( "done" , fn );
        };

        /**
         * Event got triggered on before start event;
         *
         * @public
         * @method onBeforeStart
         * @param fn {Function} Before start event listener;
         */
        this.onBeforeStart = function( fn ){
            box.add_listener( "before-start" , fn );
        };

        /**
         * Informs the listeners of the specified event;
         *
         * @public
         * @method triggerEvent
         * @param type {String} Event type the listeners to be informed about;
         */
        this.triggerEvent = function( type ){
            box.inform_listeners.apply( this, arguments );
        };

    }

    /**
     * An implementation of DrawingTools interface to draw curve on a canvas;
     *
     * @class DrawingTools.Canvas
     * @extends DrawingTools
     * @constructor
     */
    DrawingTools.Canvas = function( canvasContainer ){

        var
            canvas = document.createElement( "canvas"),

            _ctx,

            _angle_increase_step = 1;


        {
            if ( window['G_vmlCanvasManager'] ){
                G_vmlCanvasManager.initElement( canvas );
            }
            _ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
            canvasContainer ? canvasContainer.appendChild( canvas ) : undefined;
        }

        /**
         * Sets canvas width;
         *
         * @param w {Number} Canvas width;
         */
        this.setWidth = function( w ){
            if ( canvas ) {
                canvas.width = canvas.style.width = w;
            }
        };

        /**
         * Sets canvas height;
         *
         * @param h {Number} Canvas height;
         */
        this.setHeight = function( h ) {
            if ( canvas ) {
                canvas.height = canvas.style.height = h;
            }
        };

        /**
         * Gets canvas width;
         *
         * @return {*}
         */
        this.getWidth = function() {
            return canvas ? canvas.width : 0;
        };

        /**
         * Gets canvas height;
         *
         * @return {*}
         */
        this.getHeight = function() {
            return canvas ? canvas.height : 0;
        };

        /**
         * Sets size of the painted curves;
         *
         * @public
         * @method setSize
         * @param p {Number} Size multiplier;
         */
        this.setSize = function( p ){
            var d = { x : 0 , y : 0},
                dcs = this.getDragonCurves(),
                dc = dcs.length ? dcs[0] : null,
                sp = dc ? dc.getStartingPoint() : null;

            if ( canvas ){
                canvas.style.width = p*canvas.width + "px";
                canvas.style.height = p*canvas.height + "px";

                if ( sp ) {
                    d.x = (1 - p)*sp.x;
                    d.y = (1 - p)*sp.y;
                    canvas.style.marginLeft = d.x + "px";
                    canvas.style.marginTop = d.y + "px";
                }

            }
        };

        /**
         * Clears all curves and resets state;
         */
        this.clear = function(){
            this.reset();
            canvasContainer.removeChild( canvas );
        };

        /**
         * Draws the curve by the specified vertexes;
         *
         * @public
         * @method draw
         * @override DrawingTools.draw
         * @param dcs {Array} An array of DragonCurve instances;
         * @param a {Number}  Rotate angle;
         */
        this.drawAnimated = function( dcs ,  a ){
            var self = this,
                dc, sv, sp, cv , ov , v , i , l , j , k , o;

            a = a || _angle_increase_step;
            _ctx.clearRect( 0 , 0 , this.getWidth() , this.getHeight() );

            for ( i = 0 , l = dcs.length ; i < l ; i++ ){
                dc = dcs[i];
                sv = dc.getVertexes();
                sp = dc.getStartingPoint();
                o = dc.getDrawingOptions();

                dc.calculateRotatedPoints( a );
                cv = dc.getConstructedVertexes();
                ov = sv.concat( cv );

                _ctx.beginPath();

                _ctx.strokeStyle = o.color;
                _ctx.fillStyle = o.fill;
                _ctx.lineWidth = o.width;

                _ctx.moveTo( sp.x , sp.y );
                for ( j = 1 , k = ov.length ; j < k; j++ ){
                    v = ov[j];
                    _ctx.lineTo( v.x , v.y );
                }
                _ctx.stroke();

                if ( a == 90 ){
                    for ( j = 0 , k = cv.length ; j < k; j++ ){
                        dc.addVertex( cv[j] );
                    }
                }
            }

            this.triggerEvent( "redraw" , {
                angle : a,
                step : this.getStep(),
                maxSteps : this.getMaxStepsAllowed()
            });

            if ( a == 90 ){
                a = 0;
                if( this.getStep() >= this.getMaxStepsAllowed() ){
                    this.triggerEvent( "done" );
                    return;
                }
                this.increaseStep();
            }

            window.requestAnimFrame( function(){
                self.drawAnimated( dcs , a + _angle_increase_step);
            } , canvas );
        };

        /**
         * Draws dragon curves without steps animation;
         * After the pre specified delay next curve branch appears;
         *
         * @public
         * @method drawNonAnimated
         * @param dcs
         */
        this.drawNonAnimated = function( dcs ){
            var self = this,
                dc, sv, sp, cv , v , i , l , j , k , o;

            for ( i = 0 , l = dcs.length ; i < l ; i++ ){
                dc = dcs[i];
                sv = dc.getVertexes();
                o = dc.getDrawingOptions();

                dc.calculateRotatedPoints( 90 );
                cv = dc.getConstructedVertexes();
                sp = cv[0];

                _ctx.beginPath();

                _ctx.strokeStyle = o.color;
                _ctx.fillStyle = o.fill;
                _ctx.lineWidth = o.width;

                _ctx.moveTo( sp.x , sp.y );
                for ( j = 1 , k = cv.length ; j < k; j++ ){
                    v = cv[j];
                    _ctx.lineTo( v.x , v.y );
                }
                _ctx.stroke();

                for ( j = 0 , k = cv.length ; j < k; j++ ){
                    dc.addVertex( cv[j] );
                }
            }

            this.triggerEvent( "redraw" , {
                angle : 90,
                step : this.getStep(),
                maxSteps : this.getMaxStepsAllowed()
            });

            if( this.getStep() >= this.getMaxStepsAllowed() ){
                this.triggerEvent( "done" );
                return;
            }
            this.increaseStep();

            setTimeout( function(){
                self.drawNonAnimated( dcs );
            }, 500);
        };

        /**
         * Draws initial lines and vertexes the dragon curve to be constructed on;
         */
        this.drawInitial = function(){
            var dcs = this.getDragonCurves(),
                sv, or, o, dc, i , l, j, k;

            if ( _ctx == null ){
                throw new Error("Canvas context is not defined");
            }

            for ( i = 0 , l = dcs.length ; i < l ; i++ ){

                dc = dcs[i];
                sv = dc ? dc.getVertexes() : null;
                or = sv && sv[0] ? sv[0] : null;
                o = dc ? dc.getDrawingOptions() : null;
                _ctx.beginPath();

                _ctx.strokeStyle = o.color;
                _ctx.lineWidth = o.width;

                _ctx.moveTo( or.x , or.y );
                for ( j = 1 , k = sv.length ; j < k; j++ ){
                    _ctx.lineTo( sv[j].x , sv[j].y );
                }
                _ctx.stroke();
            }

        };

        /**
         * Starts animated dragon curve drawing;
         * Checks whether canvas context is defined and if no, throws an exception;
         *
         * @public
         * @method start
         * @override DrawingTools.start
         * @param animate {Boolean} Indicates whether it's necessary to animate branches motion;
         */
        this.start = function( animate ){

            var dcs = this.getDragonCurves();

            if ( _ctx == null ){
                throw new Error("Canvas context is not defined");
            }

            this.triggerEvent( "before-start" );
            this.setNeedsCleanup( true );

            animate ? this.drawAnimated( dcs ) : this.drawNonAnimated( dcs );

        };

    };


    /**
     * An implementation of DrawingTools interface to draw curve on via svg;
     *
     * @class DrawingTools.Svg
     * @extends DrawingTools
     * @constructor
     */
    DrawingTools.Svg = function( svg_container ){

        var
            _svg = box.create_svg_element( "svg" ,
                {
                    'xlink' : 'http://www.w3.org/1999/xlink'
                }
            ),

            _g = box.create_svg_element( "g" , {}),

            _delay = 10,

            _angle_increase_step = 1,

            _width,

            _height,

            _stored_paths = [];

        {
            if ( svg_container && _svg){
                svg_container.appendChild( _svg );
                _svg.appendChild( _g );
            }
        }

        /**
         * Clears all curves and resets state;
         *
         * @public
         * @method clear
         * @override
         */
        this.clear = function(){
            this.reset();
            if ( svg_container && _svg ) {
                svg_container.removeChild( _svg );
            }
        };

        /**
         * Sets width;
         * @param w {Number} Width to be set;
         */
        this.setWidth = function( w ){
            if ( _svg ) {
                _width = w;
                box.setAttribute( _svg , "width" ,  w );
            }
        };

        /**
         * Gets width;
         */
        this.getWidth = function(){

        };

        /**
         * Sets height;
         * @param h {Number} Height to be set;
         */
        this.setHeight = function( h ){
            if ( _svg ) {
                _height = h;
                box.setAttribute( _svg , "height" ,  h );
            }
        };

        /**
         * Gets height;
         */
        this.getHeight = function() {};

        /**
         * Sets size of the painted curves;
         *
         * @public
         * @method setSize
         * @param p {Number} Size multiplier;
         */
        this.setSize = function( p ){
            var d = { x : 0 , y : 0},
                dcs = this.getDragonCurves(),
                dc = dcs.length ? dcs[0] : null,
                sp = dc ? dc.getStartingPoint() : null;

            if ( _g ){
                box.setAttribute( _g , "transform" , "scale(" + p + ")" );
                box.setAttribute( _svg , "width" , p * _width );
                box.setAttribute( _svg , "height" , p * _height );

                if ( sp ) {
                    d.x = (1 - p)*sp.x;
                    d.y = (1 - p)*sp.y;
                    _svg.style.marginLeft = d.x + "px";
                    _svg.style.marginTop = d.y + "px";
                }
            }
        };

        /**
         * Build a path by a set of vertexes;
         *
         * @public
         * @method constructPath
         * @param v {Array} A set of vertexes;
         *
         * @return {String} Constructed path;
         */
        this.constructPath = function( v ){
            var p = "",
                i , l = v ? v.length : 0 ;

            if ( l ){
                p += "M " + v[0].x + " " + v[0].y + " ";
            }

            for ( i = 1 ; i < l ; i++ ){
                p += "L " + v[i].x + " " + v[i].y + " ";
            }

            return p;
        };

        /**
         * Draws the curve by the specified vertexes;
         *
         * @public
         * @method drawAnimated
         * @override DrawingTools.drawAnimated
         * @param dcs {Array} An array of DragonCurve instances;
         * @param a {Number}  Rotate angle;
         */
        this.drawAnimated = function( dcs , a ){
            var self = this,
                dc, cv , i , l , j , k , o, p, el, or ;

            a = a || _angle_increase_step;

            for ( i = 0 , l = dcs.length ; i < l ; i++ ){
                dc = dcs[i];

                if ( _stored_paths[ i ] && a != 90 ){
                    or = dc.getOrigin();
                    el = _stored_paths[ i ];
                    box.setAttribute( el , "transform", "rotate(" + a + "," + or.x + "," + or.y + ")");
                } else {
                    dc.calculateRotatedPoints( a );
                    cv = dc.getConstructedVertexes();
                    o = dc.getDrawingOptions();

                    p = this.constructPath( cv );
                    el = box.create_svg_element( "path" , {
                        d : p,
                        "stroke" : o.color,
                        "stroke-width" : o.width,
                        "fill" : o.fill
                    });
                    _g.appendChild( el );

                    if ( a == 90 ) {
                        for ( j = 0 , k = cv.length ; j < k; j++ ){
                            dc.addVertex( cv[j] );
                        }

                    } else {
                        _stored_paths.push( el );
                    }

                }
            }

            this.triggerEvent( "redraw" , {
                angle : a,
                step : this.getStep(),
                maxSteps : this.getMaxStepsAllowed()
            });

            if ( a == 90 ){
                a = 0;
                while ( _stored_paths.length ){
                    box.removeElement( _g , _stored_paths.pop() );
                }
                if( this.getStep() >= this.getMaxStepsAllowed() ){
                    this.triggerEvent( "done" );
                    return;
                }
                this.increaseStep();
            }

            setTimeout( function(){
                self.drawAnimated( dcs , a + _angle_increase_step);
            } , _delay );
        };

        /**
         * Draws dragon curves without steps animation;
         * After the pre specified delay next curve branch appears;
         *
         * @public
         * @method drawNonAnimated
         * @param dcs
         */
        this.drawNonAnimated = function( dcs ){
            var self = this,
                dc, sv, sp, cv , i , l , j , k , o, p, el;

            for ( i = 0 , l = dcs.length ; i < l ; i++ ){
                dc = dcs[i];
                sv = dc.getVertexes();
                o = dc.getDrawingOptions();

                dc.calculateRotatedPoints( 90 );
                cv = dc.getConstructedVertexes();
                sp = cv[0];

                p = this.constructPath( cv );
                el = box.create_svg_element( "path" , {
                    d : p,
                    "stroke" : o.color,
                    "stroke-width" : o.width,
                    "fill" : o.fill
                });
                _g.appendChild( el );

                for ( j = 0 , k = cv.length ; j < k; j++ ){
                    dc.addVertex( cv[j] );
                }
            }

            this.triggerEvent( "redraw" , {
                angle : 90,
                step : this.getStep(),
                maxSteps : this.getMaxStepsAllowed()
            });

            if( this.getStep() >= this.getMaxStepsAllowed() ){
                this.triggerEvent( "done" );
                return;
            }
            this.increaseStep();

            setTimeout( function(){
                self.drawNonAnimated( dcs );
            }, 500);
        };

        /**
         * Draws initial lines and vertexes the dragon curve to be constructed on;
         */
        this.drawInitial = function(){
            var dcs = this.getDragonCurves(),
                sv, or, o, dc, i , l, p, el;

            if ( _svg == null ){
                throw new Error("Svg element is not defined");
            }

            for ( i = 0 , l = dcs.length ; i < l ; i++ ){

                dc = dcs[i];
                sv = dc ? dc.getVertexes() : null;
                or = sv && sv[0] ? sv[0] : null;
                o = dc ? dc.getDrawingOptions() : null;

                p = this.constructPath( sv );

                el = box.create_svg_element( "path" , {
                    d : p,
                    "stroke" : o.color,
                    "stroke-width" : o.width
                });
                _g.appendChild( el );

            }

        };

        /**
         * Starts animated dragon curve drawing;
         * Checks whether canvas context is defined and if no, throws an exception;
         *
         * @public
         * @method start
         * @override DrawingTools.start
         * @param animate {Boolean} Indicates whether it's necessary to animate branches motion;
         */
        this.start = function( animate ){

            var dcs = this.getDragonCurves();

            if ( _svg == null ){
                throw new Error("Svg is not defined");
            }

            this.triggerEvent( "before-start" );
            this.setNeedsCleanup( true );
            animate ? this.drawAnimated( dcs ) : this.drawNonAnimated( dcs );

        };

    };
};