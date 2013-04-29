/**
 * Provides common tools for DragonCurveBox;
 *
 * @param box Reference to global constructor;
 * @constructor
 */
DragonCurveBox.modules.Commons = function( box ){

    /**
     * Converts RGB color format to hex and returns the hex string representation;
     *
     * @public
     * @method convert_to_hex_from_RGB
     * @param r {Number} Red value;
     * @param g {Number} Green value;
     * @param b {Number} Blue value;
     * @return {String}
     */
    box.convert_to_hex_from_RGB = function (r, g, b) {
        var hex = [
            r.toString( 16 ),
            g.toString( 16 ),
            b.toString( 16 )
        ];

        $.each( hex, function( nr, val ) {
            if ( val.length === 1 ) {
                hex[ nr ] = "0" + val;
            }
        });
        return hex.join( "" ).toUpperCase();
    };

    /**
     * Applies the specified size settings to the specified container;
     *
     * @public
     * @method adjust_container_settings
     * @param c {Element} Container the sizes to be applied to;
     * @param w {Number}  Width to be set;
     * @param h {Number}  Height to be set;
     * @param sl {Number} Scroll left position;
     * @param st {Number} Scroll top position;
     */
    box.adjust_container_settings = function( c, w, h, sl, st ){
        c.scrollLeft = sl;
        c.scrollTop = st;

        $(c)
            .width( w )
            .height( h );
    };

    /**
     * Stores reference to notification elements;
     * @param jq
     */
    box.set_notification_dialog_references = function( jq ){
        _notification_dialog_references = jq;
    };

    /**
     * Shows alert dialog;
     *
     * @param title {String} Dialog title
     * @param content {String} Dialog content
     * @param question {String} Dialog question
     */
    box.show_alert = function( title , content , question ){
        show_modal( "alert" , {
            "title" : title,
            "content" : content,
            "question" : question
        });
    };

    /**
     * Shows notification dialog;
     *
     * @param title {String} Dialog title
     * @param content {String} Dialog content
     * @param question {String} Dialog question
     */
    box.show_notification = function( title , content , question ){
        show_modal( "notification" , {
            "title" : title,
            "content" : content,
            "question" : question
        });

    };

    /**
     * Shows confirm dialog;
     *
     * @param title {String} Dialog title
     * @param content {String} Dialog content
     * @param question {String} Dialog question
     * @param buttons {Object} A set of buttons
     */
    box.show_confirm = function( title , content , question , buttons ){
        show_modal( "confirm" , {
            "title" : title,
            "content" : content,
            "question" : question,
            "buttons" : buttons
        });
    };

    /**
     * Creates an elements with the specified name and attributes;
     *
     * @param name {String} Element name;
     * @param attrs {Object} Element attributes;
     * @returns {HTMLElement} Created element;
     */
    box.create_svg_element = function( name , attrs ){
        var el = document.createElementNS( _svg_xmlns , name),
            k;

        for ( k in attrs ){
            if ( attrs.hasOwnProperty( k ) ){
                el.setAttribute( k , attrs[k] );
            }
        }

        return el;

    };

    /**
     * Removes the specified element;
     * @param parent {HTMLElement} Parent element;
     * @param el {HTMLElement} Element to be removed;
     */
    box.removeElement = function( parent, el ){
        parent.removeChild( el );
    };

    /**
     * Sets the specified attribute to the specified element;
     *
     * @param el {HTMLElement} Element the attribute to be set to;
     * @param attrName {String} Attribute name;
     * @param attrValue {String} Attribute value;
     */
    box.setAttribute = function( el , attrName, attrValue ){
        el.setAttribute( attrName , attrValue );
    };

    // private fields and methods
    var
        /**
         * Set of default dialog options;
         *
         * @private
         * @static
         * @property _dialog_options
         */
        _dialog_options = {
            alert : {
                title : "Alert",
                    content : "Something went wrong",
                    question : "The previous state will be restored",
                    icon : "ui-icon-alert",
            class : "error"
            },
            notification : {
                title : "Notification",
                    content : "Something can be improved...",
                    question : "Please, consider this value again",
                    icon : "ui-icon-info",
            class : "notification"
            },
            confirm : {
                title : "Confirm",
                    content : "Something needs to be confirmed...",
                    question : "Please, consider this value again",
                    icon : "ui-icon-notice",
            class : "confirm"
            }
        },

        /**
         * Reference to notification dialog elements;
         */
        _notification_dialog_references = null,

        /**
         * SVG namespace;
         */
        _svg_xmlns = "http://www.w3.org/2000/svg",

        /**
         * A common function to display a dialog of the specified type
         *
         * @private
         * @method show_modal
         * @param type  {String} Dialog type
         * @param o {Object} Set of options, containing :
         *         - title {String} Dialog title
         *         - content {String}  Dialog content
         *         - question {String} Dialog question
         *         - buttons  {Object} A set of buttons
         *         - jq {Object} Object, containing the following references to dialog parts :
         *                  - notification_dialog
         *                  - notification_dialog_content
         *                  - notification_dialog_question
         *                  - notification_dialog_icon
         */
        show_modal = function( type , o ){
            var jq = _notification_dialog_references ? _notification_dialog_references : {},
                nd = jq && jq.notification_dialog ? jq.notification_dialog : null,
                ndc = jq && jq.notification_dialog_content ? jq.notification_dialog_content : null,
                ndq = jq && jq.notification_dialog_question ? jq.notification_dialog_question : null,
                ndi = jq && jq.notification_dialog_icon ? jq.notification_dialog_icon : null;

            o = o || {};
            type = _dialog_options.hasOwnProperty( type ) ? type : "notification";
            o.title = o.title || _dialog_options[type].title;
            o.content = o.content || _dialog_options[type].content;
            o.question = o.question || _dialog_options[type].question;
            o.buttons = o.buttons || {
                "Ok" : function() {
                    $( this ).dialog( "close" );
                }
            };

            if ( nd ){
                nd.dialog( "option" , "dialogClass", _dialog_options[type].class);
                nd.dialog( "option" , "title", o.title );
                nd.dialog( "option" ,  "buttons" , o.buttons );
                nd.dialog( "option" ,  "modal" , true );

                if ( ndc ) ndc.html( o.content );
                if ( ndq ) ndq.html( o.question );
                if ( ndi ) ndi.removeClass().addClass("ui-icon " + _dialog_options[type].icon);

                nd.on('dialogopen', function(){
                    $('.ui-widget-overlay').css("position" , "fixed" );
                });
                nd.on('dialogclose', function(){
                    $('.ui-widget-overlay').css("position" , "absolute" );
                });

                nd.dialog( "open" );
            }

        };

};