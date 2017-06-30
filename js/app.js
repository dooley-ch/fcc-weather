requirejs.config({
    shim : {
        bootstrap : {
            deps : [ "jquery"],
            exports: "Bootstrap"
        }
    },

    paths: {
        jquery: "vendor/jquery-3.2.1.min",
        bootstrap : "vendor/bootstrap.min",
    }
});

define("app", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    require("bootstrap");

    var loc = require("location");
    var renderer = require("renderer");
    var weather = require("weather");

    /**
     * This funtion initializes the application 
     * and displays the weather data on the screen
     * 
     * @return {void}
     */
    function _init() {
        $(window).on("load resize", function () {
            $(".fill-screen").css("height", window.innerHeight);
        });

        $("#tempButton").click(function () { 
            renderer.toggleMetricTemp();
        });

        $("#dayButtonOne").click(function () { 
            renderer.displayForecast(0);
        });

        $("#dayButtonTwo").click(function () { 
            renderer.displayForecast(1);
        });

        $("#dayButtonThree").click(function () { 
            renderer.displayForecast(2);
        });

        $("#dayButtonFour").click(function () { 
            renderer.displayForecast(3);
        });

        $("#dayButtonFive").click(function () { 
            renderer.displayForecast(4);
        });

        loc.getLocation(function (err, loc) {
            if (err != null) {
                alert("Unable to obtain your location: " + err);
            } else {
                weather.getWeather(loc, function (err, weatherData) {
                    if (err != null) {
                        alert("Unable to obtain weather information: " + err);
                    } else {
                        renderer.display(weatherData);
                    }
                });
            }
        });
    }

    exports.init = function () {
        _init();
    };
});

requirejs(["app"], function (app) {
    "use strict";
    app.init();
});
