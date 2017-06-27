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
    var renderer = require("renderer");

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

requirejs(['app', 'renderer'], function (app, renderer) {
    'use strict';
    app.init();

    var forecasts = [];
    var currentWeather = new renderer.CurrentWeather(Date.parse("March 21, 2012"), 34.5, "02d", "Cloudy with rain", 1.2);
 
    forecasts.push(new renderer.Forecast(new Date(Date.parse("March 21, 2012")), "10d"));
    forecasts.push(new renderer.Forecast(new Date(Date.parse("March 22, 2012")), "11d"));
    forecasts.push(new renderer.Forecast(new Date(Date.parse("March 23, 2012")), "02d"));
    forecasts.push(new renderer.Forecast(new Date(Date.parse("March 24, 2012")), "04d"));
    forecasts.push(new renderer.Forecast(new Date(Date.parse("March 25, 2012")), "13d"));

    renderer.display("Kilmaine, Ireland", currentWeather, forecasts);
});
