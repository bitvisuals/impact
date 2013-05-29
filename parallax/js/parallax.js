$(function() {
    'use strict';

    var $               = window.jQuery,
        Modernizr       = window.Modernizr,
        scroller        = $('#scroller'),
        info1           = $('#info1'),
        info2           = $('#info2'), // BG Position
        info3           = $('#info3'), // Speed
        info4           = $('#info4'), // ScrollTop
        oldTop          = 0,
        top             = 0,
        speed           = 0,
        parallaxOffset  = 0.5,
        speedMultiplier = 50,
        debugInfo       = true,
        maxSpeed        = 20,
        bgY             = function(){
            return parseInt( /(?:0px|0%) (-?\d+)/.exec( scroller.css('backgroundPosition') )[1], 10);
        };

    if( Modernizr.touch ) {

        // if( debugInfo ) {
        //     scroller.on('scroll',function(){
        //         info4.text(scroller.scrollTop());
        //     });

        //     setInterval(function(){
        //         info2.text(bgY());
        //     },100);
        // } else {
        //     $('.info').hide();
        // }

        // scroller.on('touchstart',function(){
        //     top    = scroller.scrollTop();
        //     oldTop = top;
        //     speed  = 0;
        //     scroller.css({
        //         backgroundPosition: '0 ' + bgY() + 'px'
        //     });
        //     scroller.removeClass('touch-end');
        // });

        scroller.on('touchmove',function(){
            if( debugInfo ) {
                info2.text( oldTop );
            }
            top    = scroller.scrollTop();
            speed  = top - oldTop;
            oldTop = top;

            if( speed > maxSpeed ) {
                speed = maxSpeed;
            } else if( speed < -maxSpeed ) {
                speed = -maxSpeed;
            }
            
            scroller.css({
                backgroundPosition: '0 ' + ( bgY() - speed * parallaxOffset ) + 'px'
            });
            
            if( debugInfo ) {
                info1.text( top );
                info3.text( speed );
            }
            
            scroller.removeClass('touch-end');
        });

        scroller.on('touchend',function(){
            scroller.addClass('touch-end');
            scroller.css({
                backgroundPosition: '0 ' + ( bgY() - ( speed * parallaxOffset * speedMultiplier ) ) + 'px'
            });

            if( debugInfo ) {
                // info1.text( bgY() - ( speed * parallaxOffset * speedMultiplier ) );
                // info3.text(speed);
            }
        });

    } else {
        scroller.on('scroll',function(){
            top = scroller.scrollTop() + bgY();
            
            if( debugInfo ) {
                info3.text(bgY());
            }

            scroller.css({
                backgroundPosition: '0 ' + ( -top * parallaxOffset ) + 'px'
            });
        });
    }

});