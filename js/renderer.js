define(function (require, exports, module) {
    //jshint unused:false
    'use strict';

    var $ = require("jquery");

    var _useMetricTemp = true;

    var _locationID;
    var _currentImageID;
    var _currentTempID;
    var _currentWeatherID;
    var _currentWindSpeedID;

    var _location;
    var _currentWeather;
    var _forecast;

    function _init() {
        _locationID = $("#locationId");
        _currentImageID = $("#imgId");
        _currentTempID = $("#tempId");
        _currentWeatherID = $("#weatherId");
        _currentWindSpeedID = $("#windSpeedId");
    }

    function _titleCase(str) {
        var newstr = str.split(" ");

        for(var i = 0; i < newstr.length; i++){ 
            if(newstr[i] == "") continue;
            var copy = newstr[i].substring(1).toLowerCase();
            newstr[i] = newstr[i][0].toUpperCase() + copy;
        }

        newstr = newstr.join(" ");
        
        return newstr;
    }  

    function _round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    function _toFahrenheit(value) {
        return (value * (9/5)) + 32;
    }

    function _display() {
        // Show the location
        _locationID.text("(" + _location + ")");

        // Show the current weather
        var imgUrl = "img/" + _currentWeather.imgUrl + ".png";
        _currentImageID.attr("src", imgUrl);

        if (_useMetricTemp) {
            _currentTempID.text(_round(_currentWeather.temperature, 1) + " C");            
        } else {
            _currentTempID.text(_round(_toFahrenheit(currentWeather.temperature), 1) + " F");
        }

        var knots = _round(_currentWeather.windSpeed * 1.943844, 2);
        _currentWindSpeedID.text("Wind Speed: " + knots + " knots");

        _currentWeatherID.text(_titleCase(_currentWeather.weather));
    }

    function _toggleMetricTemp() {
        _useMetricTemp = !_useMetricTemp;
        _display();
    }

    exports.init = function () {
        _init();
    };    

    exports.toggleMetricTemp = function() {
        _toggleMetricTemp();
    };

    exports.display = function(location, current, forecast) {
        _location = location;
        _currentWeather = current;
        _forecast = forecast;

        _display();
    };

    exports.Forecast = function(dt, temp, imgUrl, weather, speed) {
            this.temperatureDate = dt;
            this.temperature = temp;
            this.imgUrl = imgUrl;
            this.weather = weather;
            this.windSpeed = speed;
    };
});