var app = app || {};

(function(){
    'use strict';

    var $         = window.jQuery,
        IScroll   = window.iScroll,
        console   = window.console,
        Modernizr = window.Modernizr;
    
    app.pl = {
        scroller             : $('#scroller'),
        list                 : $('#scroller ul'),
        listLength           : 50,
        top                  : 0,
        debug                : false,
        scrolling            : false,
        opacity              : 0,
        maxOpacity           : localStorage.getItem('maxOpacity')           || 0.9,
        minOpacity           : localStorage.getItem('minOpacity')           || 0.4,
        scrollStartFadeSpeed : localStorage.getItem('scrollStartFadeSpeed') || 100,
        touchMultiplier      : localStorage.getItem('touchMultiplier')      || 0.9,
        releaseMultiplier    : localStorage.getItem('releaseMultiplier')    || 1,
        parallaxOffset1      : localStorage.getItem('parallaxOffset1')      || 0.4,
        parallaxOffset2      : localStorage.getItem('parallaxOffset2')      || 0.6,
        parallaxOffset3      : localStorage.getItem('parallaxOffset3')      || 0.8,

        // Update each value in the form from attributes object
        init: function(){
            if( app.pl.scroller.length ) {
                app.pl.list.css({
                    opacity: app.pl.maxOpacity
                });

                // Toggle delete state on tap
                $('.shopping-list-scroller .content').each(function(scroller){
                    scroller.tap(function(){
                        $(this).parent().toggleClass('delete');
                    });
                });

                // Populate form from attributes object
                $('#form input').each(function(){
                    this.value = app.pl[this.id];
                    $(this).prev().find('span').text(this.value);
                });
                $('#form input').change( app.pl.updateAttributeFromInput );

                app.pl.createList();
                app.pl.initFileDrop();
                app.pl.initScroller();
            }
        },

        createList: function(){
            for( var i = 0; i < app.pl.listLength; i++ ) {
                var itemType = app.rand(0,1) ? 'category' : 'product';
                var key      = app.rand(0,1) ? '<div class="key"></div>' : '';
                var amount   = app.weightedRand(0,10);

                app.pl.list.append($(
                    '<li class="' + itemType + '"><div class="action">' + key +
                    '</div><div class="content"><div class="amount">' + ( amount ? amount : '' ) + '</div><b>' +
                    app.randomString(7,12) + ' ' + app.randomString(7,12) + '</b><small>' +
                    app.randomString(7,12) + ' ' + app.randomString(7,12) +
                    '</small></div></li>'
                ));
            }
        },
        // Updates an attribute when the related input field is changed
        updateAttributeFromInput: function(){
            app.pl[this.id] = this.value;
            localStorage.setItem( this.id, this.value );
            $(this).prev().find('span').text(this.value);
        },

        initScroller: function(){
            // Disable parallax scrolling for Android
            if( navigator.userAgent.match(/Android/) ){
                app.pl.scroller.addClass('touchScroll');
            } else {
                var myScroll = new IScroll('scroller',{
                    onScrollStart: function(){
                        if( app.pl.scrolling ) {
                            app.pl.list.fadeTo( parseInt(app.pl.scrollStartFadeSpeed,10), app.pl.maxOpacity );
                        }
                        app.pl.scrolling = true;

                        if( app.pl.debug ) {
                            console.log('Scroll start');
                        }
                    },
                    onScrollEnd: function(){
                        app.pl.list.fadeTo( parseInt(app.pl.scrollStartFadeSpeed,10), app.pl.maxOpacity );
                        app.pl.scrolling = false;

                        if( app.pl.debug ) {
                            console.log('Scroll end');
                        }
                    },
                    onScrollMove: function( e, speed, easeOut ){
                        if( easeOut ) {
                            app.pl.opacity = app.pl.maxOpacity * easeOut * app.pl.releaseMultiplier;
                        }

                        else if( speed ) {
                            app.pl.opacity = app.pl.maxOpacity * ( app.pl.touchMultiplier - speed );
                        }

                        if( app.pl.opacity < app.pl.minOpacity ) {
                            app.pl.opacity = app.pl.minOpacity;
                        }

                        app.pl.list.css({
                            opacity: app.pl.opacity
                        });

                        app.pl.scroller.css({
                            backgroundPosition: '0 ' + ( this.y * app.pl.parallaxOffset3 ) + 'px, ' + '0 ' + ( this.y * app.pl.parallaxOffset2 ) + 'px, ' + '0 ' + ( this.y * app.pl.parallaxOffset1 ) + 'px'
                        });
                    }
                });
            }
        },

        initFileDrop: function(){
            var itemNo = 1;

            $('.filedrop').filedrop({
                url: 'upload.php',
                paramname: 'file',
                data: {
                    itemNo: function(){
                        return itemNo;
                    }
                },
                globalProgressUpdated: function(progress) {
                    $('#progress').width( progress + '%' );

                    if( progress === 100 ) {
                        setTimeout(function(){
                            $('#progress').width( 0 );
                        },300);
                    }
                },
                dragOver: function() {
                    $(this).addClass('over');
                    itemNo = parseInt($(this).text(),10);
                },
                dragLeave: function() {
                    $(this).removeClass('over');
                },
                drop: function() {
                    $(this).removeClass('over');
                },
                error: function(err, file) {
                    switch(err) {
                        case 'BrowserNotSupported':
                            window.alert('browser does not support html5 drag and drop');
                            break;
                        case 'TooManyFiles':
                            // user uploaded more than 'maxfiles'
                            break;
                        case 'FileTooLarge':
                            // program encountered a file whose size is greater than 'maxfilesize'
                            // FileTooLarge also has access to the file which was too large
                            // use file.name to reference the filename of the culprit file
                            break;
                        case 'FileTypeNotAllowed':
                            // The file type is not in the specified list 'allowedfiletypes'
                            break;
                        default:
                            break;
                    }
                },
                allowedfiletypes: ['image/png']
            });
        }
    };
}());
