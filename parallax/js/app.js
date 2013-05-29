var app;
(function(){
    'use strict';

    var $         = window.jQuery,
        console   = window.console,
        Modernizr = window.Modernizr;

    app = {
        init: function(){
            app.pl.init();
            app.activateTabs();
            app.activateShareBars();
            app.drawKeyLogo();
        },

        // Generate a random number
        rand: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // Generate a random number weighted towards 0
        weightedRand: function(min, max) {
            return Math.floor((Math.random() * Math.random() ) * (max - min + 1)) + min;
        },

        // Generate a random string
        randomString: function(min, max) {
            return Math.random().toString(36).substring(app.rand(min,max));
        },

        activateTabs: function(){
            $('.tabs, .btn-group').each(function(tab){
                $(this).on('click','li,.btn',function(){
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    return false;
                });
            });
        },

        activateShareBars: function(){
            $('.sharebar').each(function(){
                var that = this;

                $(this).find('.sharebar-handlebar').click(function(){
                    $(that).find('.sharebar-content').toggleClass('closed');
                });
            });
        },

        drawKeyLogo: function(){
            var canvas = $('#keyCanvas')[0];

            if( canvas ) {
                // get canvas context, determine radius and center
                var ctx        = canvas.getContext('2d'),
                    canvasSize = [canvas.width, canvas.height],
                    radius     = Math.min(canvasSize[0], canvasSize[1]),
                    center     = [canvasSize[0]/2, canvasSize[1]/2],
                    total      = 100,
                    amount     = 60,
                    color      = '#008633';

                ctx.beginPath();
                ctx.moveTo(center[0], center[1]); // center of the pie
                ctx.arc(
                    center[0],
                    center[1],
                    radius,
                    Math.PI * (- 0.5 + 2 ), // -0.5 sets set the start to be top
                    Math.PI * (- 0.5 + 2 * ( amount / total )),
                    false
                );

                ctx.lineTo(center[0], center[1]); // line back to the center
                ctx.closePath();
                ctx.fillStyle = color;    // color
                ctx.fill();
            }
        }
    };
}());
