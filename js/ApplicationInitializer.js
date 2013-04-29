/**
 * Initializes application by binding event handlers to controls,
 * initializing ui components and storing references to jQuery elements;
 */
DragonCurveBox( '*' , function( box ){

    $(function(){

        var
            /**
             * A set of model values;
             *
             * @private
             * @property _model
             * @type {Object}
             */
            _model = {

                /**
                 * Name of the currently selected renderer;
                 *
                 * @private
                 * @property renderer
                 * @type {String}
                 */
                renderer : "svg",

                /**
                 * Renderer size;
                 *
                 * @private
                 * @const
                 * @property RENDERER_SIZE
                 * @type {{svg :Number, canvas:Number}}
                 */
                RENDERER_SIZE : {
                    svg : 10000,
                    canvas : 2000
                },

                /**
                 * Starting point of all dragon curves;
                 * It resides on the middle of the renderer;
                 *
                 * @private
                 * @const
                 * @property START
                 * @type { Object }
                 */
                START : {
                    x : {
                        svg : 5000,
                        canvas : 1000
                    },
                    y : {
                        svg : 5000,
                        canvas : 1000
                    }
                },

                /**
                 * Curves number indicator;
                 *
                 * @private
                 * @property curves_number
                 * @type {Number}
                 */
                curves_number : 4,

                /**
                 * Number indicating the maximum number of step - branches - allowed;
                 *
                 * @private
                 * @property max_steps_allowed
                 * @type {Number}
                 */
                max_steps_allowed : 5,

                /**
                 * Width of the container;
                 *
                 * @private
                 * @property container_width
                 * @type {Number}
                 */
                container_width : 1000,

                /**
                 * Height of the container;
                 *
                 * @private
                 * @property container_height
                 * @type {Number}
                 */
                container_height : 1000,

                /**
                 * Indicates whether it's necessary to animate motion or not;
                 *
                 * @private
                 * @property animate_motion
                 * @type {Boolean}
                 */
                animate_motion : true,

                /**
                 * Curves colors;
                 *
                 * @private
                 * @property colors
                 * @type {Array}
                 */
                curve_colors : [
                    {
                        red : 0,
                        green : 0,
                        blue : 0
                    },
                    {
                        red : 255,
                        green : 140,
                        blue : 60
                    },
                    {
                        red : 40,
                        green : 200,
                        blue : 40
                    },
                    {
                        red : 60,
                        green : 160,
                        blue : 200
                    }
                ],

                /**
                 * An array, storing curve widths;
                 *
                 * @private
                 * @property curve_widths
                 * @type {Array}
                 */
                curve_widths : [
                    1,
                    1,
                    1,
                    1
                ],

                /**
                 * An array, storing initial segment lengths;
                 *
                 * @private
                 * @property segment_lengths
                 * @type {Array}
                 */
                segment_lengths : [
                    5,
                    5,
                    5,
                    5
                ],

                /**
                 * An array, storing initial segment angles in degrees;
                 *
                 * @private
                 * @property segment_angles
                 * @type {Array}
                 */
                segment_angles : [
                    0,
                    90,
                    180,
                    270
                ],

                /**
                 * Drawing tool;
                 *
                 * @private
                 * @property drawer
                 * @type {DrawingTools}
                 */
                drawer : null
            },

            /**
             * A set of jQuery references to DOM elements;
             *
             * @private
             * @property _view
             * @type {Object}
             */
            _view = {
                renderer_selector : $("#renderer-radio"),

                start_button : $("#start"),

                cleanup_button : $("#cleanup-curve"),

                curves_number_slider : $("#curves-number-slider"),

                curves_number : $("#curves-number"),

                progressbar : $("#progressbar"),

                max_steps_allowed_spinner : $("#max-steps-allowed-spinner"),

                container_width : $("#container-width"),

                container_height : $("#container-height"),

                accordion : $("#accordeon"),

                curve_settings_tabs : $("#initial-curve-settings"),

                animate_motion_button : $("#animate-motion-button"),

                animate_motion_label : $("#animate-motion-state"),

                color_pickers : [
                    {
                        red : $("#curve-1-red"),
                        green : $("#curve-1-green"),
                        blue : $("#curve-1-blue"),
                        swatch : $("#curve-1-swatch"),
                        hex : $("#curve-1-hex")
                    },
                    {
                        red : $("#curve-2-red"),
                        green : $("#curve-2-green"),
                        blue : $("#curve-2-blue"),
                        swatch : $("#curve-2-swatch"),
                        hex : $("#curve-2-hex")
                    },
                    {
                        red : $("#curve-3-red"),
                        green : $("#curve-3-green"),
                        blue : $("#curve-3-blue"),
                        swatch : $("#curve-3-swatch"),
                        hex : $("#curve-3-hex")
                    },
                    {
                        red : $("#curve-4-red"),
                        green : $("#curve-4-green"),
                        blue : $("#curve-4-blue"),
                        swatch : $("#curve-4-swatch"),
                        hex : $("#curve-4-hex")
                    }
                ],

                curve_width : [
                    {
                        slider : $("#curve-1-width-slider"),
                        value : $("#curve-1-width-value")
                    },
                    {
                        slider : $("#curve-2-width-slider"),
                        value : $("#curve-2-width-value")
                    },
                    {
                        slider : $("#curve-3-width-slider"),
                        value : $("#curve-3-width-value")
                    },
                    {
                        slider : $("#curve-4-width-slider"),
                        value : $("#curve-4-width-value")
                    }
                ],

                segment_settings : [
                    {
                        length : $("#curve-1-segment-length"),
                        angle : $("#curve-1-segment-angle")
                    },
                    {
                        length : $("#curve-2-segment-length"),
                        angle : $("#curve-2-segment-angle")
                    },
                    {
                        length : $("#curve-3-segment-length"),
                        angle : $("#curve-3-segment-angle")
                    },
                    {
                        length : $("#curve-4-segment-length"),
                        angle : $("#curve-4-segment-angle")
                    }
                ],

                settings_tabs : $("#settings-tabs"),

                notification_dialog : $("#notification-dialog"),
                notification_dialog_content : $("#notification-dialog-content"),
                notification_dialog_question : $("#notification-dialog-question"),
                notification_dialog_icon : $("#notification-dialog-icon-holder"),

                size : $("#size"),
                size_slider : $("#size-slider")

            },

            /**
             * A set of controllers;
             *
             * Handle all events and perform the required operations;
             */
            _controller = {

                /**
                 * Listens to 'change' event, which is triggered and a radio in a set is selected;
                 * On change, updates renderer value;
                 *
                 * @private
                 * @method renderer_selector_change_listener
                 */
                renderer_selector_change_listener : function(){
                    _model.renderer = _view.renderer_selector.find("input[type='radio']:checked").val();
                },

                /**
                 * Handles start button click;
                 * Creates the specified number of dragon curves, initializes them,
                 * initializes drawing tools and starts animation;
                 *
                 * @private
                 * @method start_button_click_handler
                 */
                start_button_click_handler : function(){

                    var c = document.getElementById( _model.renderer + "-container"),
                        d = _model.drawer = box.createDrawingToolsInstance( _model.renderer, c ),
                        dc, i;

                    if ( d == null ){
                        throw new Error("_controller.start_button_click_handler : there is no drawing tool for " + _model.renderer + " renderer" );
                    }

                    /*
                     Initializing dragon curves and adding them to drawer...
                     */
                    for ( i = 0 ; i < _model.curves_number ; i ++ ){
                        dc = box.createDragonCurveInstance({
                            vertexes : [
                                {
                                    x : _model.START.x[ _model.renderer ],
                                    y : _model.START.y[ _model.renderer ]
                                },
                                {
                                    x : _model.START.x[ _model.renderer ] + _model.segment_lengths[ i ] * Math.cos( _model.segment_angles[ i ] * Math.PI / 180 ),
                                    y : _model.START.y[ _model.renderer ] + _model.segment_lengths[ i ] * Math.sin( _model.segment_angles[ i ] * Math.PI / 180 )
                                }
                            ],
                            width: _model.curve_widths[ i ],
                            color : "#" + box.convert_to_hex_from_RGB( _model.curve_colors[i].red , _model.curve_colors[i].green, _model.curve_colors[i].blue )
                        });

                        d.addDragonCurve( dc );
                    }

                    /*
                     Initializing drawer properties...
                     */
                    d.setWidth( /*_model.container_width*/ _model.RENDERER_SIZE[ _model.renderer ] );
                    d.setHeight( /*_model.container_height*/ _model.RENDERER_SIZE[ _model.renderer ] );
                    d.setMaxStepsAllowed( _model.max_steps_allowed );

                    d.onRedraw( function( o ){
                        var a = o && o.angle ? o.angle : 0,
                            s = o && o.step ? o.step : 0,
                            m = o && o.maxSteps ? o.maxSteps : 0,
                            v;

                        v = ( s * 90 + a )/Math.max( ( m + 1 ) * 90 , 1 ) * 100;
                        _view.progressbar.progressbar( "value" , v );
                    });
                    d.onDone( function(){
                        _view.accordion.accordion( "enable" );
                    });
                    d.onBeforeStart( function(){
                        //drawer.clear();
                    });

                    _view.progressbar.progressbar( "enable" );
                    _view.accordion.accordion( "option", "active", 2 );

                    box.adjust_container_settings( c.parentNode , _model.container_width , _model.container_height , _model.START.x[ _model.renderer ] - _model.container_width / 2 , _model.START.y[ _model.renderer ] - _model.container_height / 2 );

                    d.drawInitial();
                    d.start( _model.animate_motion );

                },

                /**
                 * Handles cleanup button clicks;
                 * Removes rendered dragon curves, resets drawer state, progressbar
                 * and activates settings tabs;
                 *
                 * @private
                 * @method cleanup_button_click_handler
                 */
                cleanup_button_click_handler : function(){
                    var d = _model.drawer;

                    if ( d ){
                        d.clear();
                        d.setNeedsCleanup( false );
                        _view.settings_tabs.tabs( "option" , "disabled" , [ 0 ]).tabs( "option" , "active" , 1 );
                        _view.progressbar.progressbar( "value" , 0 );
                        _view.start_button.button( "enable" );
                        _view.size_slider.slider( "value" , 100 );
                        _view.size.html( 100 );
                    }
                },

                /**
                 * Handles slider's 'slide' event by updating the curves_number slider value;
                 * Also, enables or disables curves settings tabs according to the current curve number selected;
                 *
                 * @private
                 * @method curves_number_slider_slide_handle
                 * @param e  {Event} Event object;
                 * @param ui {Object} UI object;
                 */
                curves_number_slider_slide_handle : function( e , ui ){
                    var n = Number( ui.value),
                        at = Number( _view.curve_settings_tabs.tabs( "option" , "active" )),
                        d = [];

                    if ( at >= n ){
                        _view.curve_settings_tabs.tabs( "option" , "active" , n - 1 );
                    }

                    _view.curves_number.html( ui.value );
                    _model.curves_number = n;
                    while ( n < 4 ){
                        d.push( n++ );
                    }

                    _view.curve_settings_tabs.tabs( "option" , "disabled" , d );
                },

                /**
                 * Handles slider's 'slide' event by updating the curves_width value;
                 *
                 * @private
                 * @method curves_width_slider_slide_handle
                 * @param i {Number} Curve index;
                 * @param e  {Event} Event object;
                 * @param ui {Object} UI object;
                 */
                curves_width_slider_slide_handle : function( i, e , ui ){
                    _model.curve_widths[ i ] = Number( ui.value );
                    _view.curve_width[ i ].value.html( ui.value );
                },

                /**
                 * Handles 'animate motion' button click;
                 * Turns on or off animation effect;
                 *
                 * @private
                 * @method animate_motion_button_click_handler
                 */
                animate_motion_button_click_handler : function(){
                    var isOn = !($(this).hasClass("on"));

                    $(this).toggleClass("on");

                    _view.animate_motion_label.html( isOn ? "on" : "off" );
                    _model.animate_motion = isOn;
                },

                /**
                 * Handles both slide and change event;
                 * Updates curve color, visual representation;
                 *
                 * @private
                 * @method  color_picker_change_handle
                 * @param i {Number} Number of the color picker;
                 */
                color_picker_change_handle : function( i ){
                    var p = _view.color_pickers[ i ],
                        m = _model.curve_colors[ i ],
                        r = p ? p.red.slider( "value" ) : null,
                        g = p ? p.green.slider( "value" ) : null,
                        b = p ? p.blue.slider( "value" ) : null,
                        hex = r != null && g != null && b != null ? box.convert_to_hex_from_RGB( r, g, b ) : null;

                    p.swatch.css( "background-color", "#" + hex );
                    p.hex.html( hex ).css( "color", "#" + hex );

                    if ( m ){
                        m.red = r;
                        m.green = g;
                        m.blue = b;
                    }
                },

                /**
                 * Handles accordion's 'beforeActivate' event;
                 * If the dragon curves have just been drawn and settings panel is opened,
                 * then before to proceed to setting tab we have to clean the curves up;
                 * So, disables 'start' button, settings tabs and activates 'cleanup' tab;
                 *
                 * @private
                 * @method accordion_before_activate_handler
                 * @param e  {Event} Event object;
                 * @param ui {Object} UI object;
                 */
                accordion_before_activate_handler : function( e , ui ){
                    var np = ui ? ui.newPanel : null,
                        d = _model.drawer;

                    if ( np && np.attr("id") === "settings" && d && d.needsCleanup() ){
                        // todo : remove hard coded length;
                        _view.settings_tabs.tabs( "option" , "disabled" , [ 1 , 2 , 3 ]);
                        _view.start_button.button( "disable" );
                    }
                },

                /**
                 * Handles accordion's 'Activate' event;
                 * If the dragon curves have just been drawn and settings panel is opened,
                 * then before to proceed to setting tab we have to clean the curves up;
                 * So, have to show 'cleanup' tab;
                 *
                 * @private
                 * @method accordion_activate_handler
                 * @param e  {Event} Event object;
                 * @param ui {Object} UI object;
                 */
                accordion_activate_handler : function( e , ui ){
                    var np = ui ? ui.newPanel : null,
                        d = _model.drawer;

                    if ( np && np.attr("id") === "settings" && d && d.needsCleanup() ){
                        _view.settings_tabs.tabs( "option" , "active" , 0 );
                    }
                },

                /**
                 * Handles 'max_steps_allowed' spinner change event;
                 * If the value exceeds 15, then show notification window, suggesting to decrease steps number to proposed value;
                 *
                 * @private
                 * @method max_steps_allowed_change_handler
                 * @param e  {Event} Event object;
                 * @param ui {Object} UI object;
                 */
                max_steps_allowed_change_handler : function( e , ui ){
                    var n = Number( ui.value );

                    if ( ui.value ) {
                        _model.max_steps_allowed = n;
                    } else if ( _model.max_steps_allowed > 15 && e.type === "spinchange"){
                        box.show_confirm(
                            "Performance issue ..." ,
                            "With an animation toggled on the number of steps exceeding 15 may cause your browser to crash",
                            "Do you want to use the required number equal to 15 and left as is ?" , {
                                "Use required" : function(){
                                    _view.max_steps_allowed_spinner.spinner( "value" , _model.max_steps_allowed = 15 );
                                    $( this).dialog( "close" );
                                },
                                "Left as is" : function(){
                                    $( this).dialog( "close" );
                                }
                            }
                        );
                    }
                },

                /**
                 * Handler for keydown events in numeric fields;
                 * Only numbers and backspace are allowed;
                 *
                 * @private
                 * @method numeric_inputs_keydown_handler
                 * @param e {Event} Event object;
                 */
                numeric_inputs_keydown_handler : function( e ){
                    // Allow: backspace, delete, tab, escape, and enter
                    if ( e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 27 || e.keyCode == 13 ||
                        // Allow: Ctrl+A
                        (e.keyCode == 65 && e.ctrlKey === true) ||
                        // Allow: home, end, left, right
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                    }
                    else {
                        // Ensure that it is a number and stop the keypress
                        if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105 )) {
                            e.preventDefault();
                        }
                    }
                },

                /**
                 * Handles 'change' event for 'width' and 'height' fields;
                 * Checks whether numbers are :
                 *  - positive
                 *  - not very large ( less then 100000 );
                 *
                 * @private
                 * @method width_height_change_handler
                 * @param e {Event} Event object;
                 */
                width_height_change_handler : function( e ){
                    var t = this ? $( this ) : null,
                        id = t ? t.attr( "id").replace("-","_") : null,
                        v = t ? t.val() : null,
                        m = id ? _model[ id ] : null,
                        o = {},
                        c = {},
                        err, msg = "";

                    c[ id ] = box.types.isNormalContainerSize;
                    box.setValidationConfig( c );

                    o[ id ] = v;
                    err = box.validate(o);

                    if ( err && err.length ){
                        $.each( err , function( i , e ){
                            msg += e + "\n";
                        });
                        box.show_alert( "The value is not valid" , msg , "The value " + m + " will be restored");
                        t.val( m );
                    } else {
                        _model[ id ] = v;
                    }
                },

                /**
                 * Handles 'change' event for 'coordinates' fields;
                 *
                 * @param e {Event} Event object;
                 */
                coordinates_change_handler : function( e ){
                    var t = this ? $( this ) : null,
                        id = t ? t.attr( "id" ).replace("-","_") : null,
                        v = t ? t.val() : null,
                        err, msg = "",
                        o = {},
                        c = {};

                    c[ id ] = box.types.isNormalCoordinate;
                    box.setValidationConfig( c );

                    o[ id ] = v;
                    err = box.validate(o);

                    if ( err && err.length ){
                        $.each( err , function( i , e ){
                            msg += e + "\n";
                        });
                        box.show_notification( "The value is not good enough..." , msg , "Please, check the value again");
                    }
                },

                /**
                 * Handles size slider change events;
                 *
                 * @param e  {Event} Event object;
                 * @param ui
                 */
                size_slider_slide_handler : function( e, ui ){
                    var n = ui.value ? Number( ui.value ) : null;

                    if ( n != null ){
                        _view.size.html( n );
                        if ( _model.drawer ){
                            _model.drawer.setSize( n/100 );
                        }
                    }
                },

                /**
                 * Handles 'change' event for 'segment length' fields;
                 *
                 * @param i {Number} Position of the element in the array;
                 * @param e {Event} Event object;
                 */
                segment_length_change_handler : function( i , e ){
                    var t = this ? $( this ) : null,
                        id = t ? t.attr( "id" ).replace("-","_") : null,
                        v = t ? Number( t.val() ) : null,
                        m = _model.segment_lengths[ i ],
                        err, msg = "",
                        o = {},
                        c = {};

                    c[ id ] = box.types.isNormalSegmentLength;
                    box.setValidationConfig( c );

                    o[ id ] = v;
                    err = box.validate(o);

                    if ( err && err.length ){
                        $.each( err , function( i , e ){
                            msg += e + "\n";
                        });
                        box.show_notification( "The value is not good enough..." , msg , "The value " + m + " will be restored");
                        t.val( m );
                        t.focus();
                    } else {
                        _model.segment_lengths[ i ] = v;
                    }
                },

                /**
                 * Handles 'slide' event;
                 *
                 * @param i {Number} Position of the element in the array;
                 * @param v {Number} New value;
                 */
                segment_angle_slide_handler : function( i , v ){
                    _model.segment_angles[ i ] = v;
                }

            },

            /**
             * A set of plugin initializers;
             */
            _initializers = {

                renderer_selector_initialized : function(){
                    _view.renderer_selector.buttonset().change( _controller.renderer_selector_change_listener );
                },

                start_button_initializer : function(){
                    _view.start_button.button({
                        icons: {
                            primary: "ui-icon-play"
                        }
                    }).click( _controller.start_button_click_handler );
                },

                cleanup_button_initializer : function(){
                    _view.cleanup_button.button({
                        icons: {
                            primary: "ui-icon-trash"
                        }
                    }).click( _controller.cleanup_button_click_handler );
                },

                curves_number_slider_initialized : function(){
                    _view.curves_number_slider.slider({
                        min : 1,
                        max : 4,
                        range : "min",
                        value : _model.curves_number,
                        slide : _controller.curves_number_slider_slide_handle
                    });
                    _view.curves_number.html( _model.curves_number );
                },

                progressbar_initializer : function(){
                    _view.progressbar.progressbar({
                        value : 0,
                        max : 100,
                        disabled : true
                    });
                },

                max_steps_allowed_spinner_initializer : function(){
                    // todo : notify if number is too large...
                    _view.max_steps_allowed_spinner.spinner({
                        min : 2,
                        max : 20,
                        numberFormat: "n",
                        change : _controller.max_steps_allowed_change_handler,
                        spin : _controller.max_steps_allowed_change_handler
                    });
                },

                container_width_initializer : function(){
                    _view.container_width.val( _model.container_width )
                        .keydown( _controller.numeric_inputs_keydown_handler )
                        .change( _controller.width_height_change_handler );
                },

                container_height_initializer : function(){
                    _view.container_height.val( _model.container_height )
                        .keydown( _controller.numeric_inputs_keydown_handler )
                        .change( _controller.width_height_change_handler );
                },

                accordion_initializer : function(){
                    _view.accordion.accordion({
                        icons: {
                            header: "ui-icon-circle-arrow-e",
                            activeHeader: "ui-icon-circle-arrow-s"
                        },
                        heightStyle: "content",
                        disabled: false,

                        beforeActivate: _controller.accordion_before_activate_handler,
                        activate: _controller.accordion_activate_handler
                    });
                },

                curve_settings_tabs_initializer : function(){
                    _view.curve_settings_tabs.tabs({

                    });
                },

                animate_motion_button_initializer : function(){
                    _view.animate_motion_button.click( _controller.animate_motion_button_click_handler );
                    _view.animate_motion_label.html( _model.animate_motion ? "on" : "off ");
                    if ( _model.animate_motion ){
                        _view.animate_motion_button.addClass( "on" );
                    }
                },

                color_pickers_initializer : function(){
                    $.each( _view.color_pickers , function( i , cp ){
                        var cc = _model.curve_colors[i];
                        $.each([ cp.red , cp.green , cp.blue ], function( j, s) {
                            s.slider({
                                orientation: "horizontal",
                                range: "min",
                                max: 255,
                                value: cc [ j == 2 ? "blue" : j == 1 ? "green" : "red" ],
                                slide: function( ){
                                    _controller.color_picker_change_handle( i );
                                },
                                change: function(){
                                    _controller.color_picker_change_handle( i );
                                }
                            });
                        });
                        _controller.color_picker_change_handle( i );
                    });
                },

                curve_widths_initializer : function(){
                    $.each( _view.curve_width , function( i , cw ){
                        cw.slider.slider({
                            min : 1,
                            max : 3,
                            range : "min",
                            slide : function( e , ui ){
                                _controller.curves_width_slider_slide_handle( i , e , ui );
                            },
                            change : function( e , ui ){
                                _controller.curves_width_slider_slide_handle( i , e , ui );
                            }
                        });
                        cw.slider.slider( "value" , _model.curve_widths[ i ]);
                    });
                },

                settings_tabs_initializer : function(){
                    _view.settings_tabs.tabs({
                        show : {
                            effect: "slide",
                            duration: 800
                        },
                        disabled: [ 0 ],
                        active : 1
                    });
                },

                notification_dialog_initializer : function(){
                    _view.notification_dialog.dialog({
                        modal : true,
                        height : "auto",
                        width : "auto",
                        autoOpen: false,
                        closeOnEscape: true,
                        resizable: false,
                        draggable: false
                    });
                },

                size_slider_initializer : function(){
                    _view.size_slider.slider({
                        min:10,
                        max:300,
                        value: 100,
                        step:10,
                        slide : _controller.size_slider_slide_handler
                    });
                    _view.size.html( 100 );
                },

                _segment_settings_initializer : function(){
                    $.each( _view.segment_settings, function( i , s ){
                        s.length.change( function( e ){
                            _controller.segment_length_change_handler.call( this, i , e );
                        });

                        s.angle.circleSlider({
                            min : 0,
                            max : 359,
                            step : 1,
                            value : _model.segment_angles[ i ],
                            slide : function( v ){
                                _controller.segment_angle_slide_handler( i , v );
                            }
                        });
                    });
                },

                _notification_dialog_initializer : function(){
                    box.set_notification_dialog_references({
                        "notification_dialog" : _view.notification_dialog,
                        "notification_dialog_content" : _view.notification_dialog_content,
                        "notification_dialog_question" : _view.notification_dialog_question,
                        "notification_dialog_icon" : _view.notification_dialog_icon
                    });
                }
            };

        /**
         * Initializes all plugins;
         */
        (function _init(){
            var f;

            for ( f in _initializers ){
                if ( _initializers.hasOwnProperty(f) && typeof _initializers[f] === "function" ){
                    _initializers[f].call( this , null );
                }
            }
        })();

    });
});