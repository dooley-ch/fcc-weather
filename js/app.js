requirejs.config({
    shim : {
        bootstrap : {
            deps : [ 'jquery'],
            exports: 'Bootstrap'
        }
    },

    paths: {
        jquery: 'vendor/jquery-3.2.1.min',
        bootstrap : 'vendor/bootstrap.min'
    }
});

define("app", function (require, exports, module) {
    //jshint unused:false
    'use strict';

    var $ = require("jquery");
    var bootstrap = require("bootstrap");
    
    var loc = require("location");
    var renderer = require("renderer");
    var weather = require("weather");

    function _init() {
        $(window).on("load resize", function () {
            $(".fill-screen").css("height", window.innerHeight);
        });

        renderer.init();

        $("#tempButton").click(function (e) { 
            renderer.toggleMetricTemp();
        });

        $("#dayButtonOne").click(function (e) { 
            renderer.displayDayOne();
        });

        $("#dayButtonTwo").click(function (e) { 
            renderer.displayDayTwo();
        });

        $("#dayButtonThree").click(function (e) { 
            renderer.displayDayThree();
        });

        $("#dayButtonFour").click(function (e) { 
            renderer.displayDayFour();
        });

        $("#dayButtonFive").click(function (e) { 
            renderer.displayDayFive();
        });
    }

    exports.init = function () {
        _init();
    };
});

requirejs(['app', 'renderer', 'weather'], function (app, renderer, weather) {
    'use strict';
    app.init();

    weather.getWeather("4900", "ch", function (data) {
        renderer.display("Kilmaine, Ireland", data);
    });
});
