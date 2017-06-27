define(function (require, exports, module) {
    //jshint unused:false
    'use strict';

    var $ = require("jquery");

    var _useMetricTemp = true;

    var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var _locationID;
    var _currentImageID;
    var _currentTempID;
    var _currentWeatherID;
    var _currentWindSpeedID;

    var _location;
    var _currentWeather;
    var _forecasts;

    function _init() {
        _locationID = $("#locationId");
        _currentImageID = $("#imgId");
        _currentTempID = $("#tempId");
        _currentWeatherID = $("#weatherId");
        _currentWindSpeedID = $("#windSpeedId");
    }

    function _getDayOfWeek(dt) {
        return weekdays[dt.getDay()];
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
            _currentTempID.text(_round(_toFahrenheit(_currentWeather.temperature), 1) + " F");
        }

        var knots = _round(_currentWeather.windSpeed * 1.943844, 2);
        _currentWindSpeedID.text("Wind Speed: " + knots + " knots");

        _currentWeatherID.text(_titleCase(_currentWeather.weather));

        // Show forecast icons
        var item = _forecasts[0];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayOneImage").attr("src", imgUrl);
        $("#dayOneDate").text(_getDayOfWeek(item.date));

        item = _forecasts[1];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayTwoImage").attr("src", imgUrl);
        $("#dayTwoDate").text(_getDayOfWeek(item.date));

        item = _forecasts[2];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayThreeImage").attr("src", imgUrl);
        $("#dayThreeDate").text(_getDayOfWeek(item.date));

        item = _forecasts[3];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayFourImage").attr("src", imgUrl);
        $("#dayFourDate").text(_getDayOfWeek(item.date));

        item = _forecasts[4];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayFiveImage").attr("src", imgUrl);
        $("#dayFiveDate").text(_getDayOfWeek(item.date));
    }

    function _toggleMetricTemp() {
        _useMetricTemp = !_useMetricTemp;
        _display();
    }

    function _displayDayOne() {
        alert("Day One");
    }

    function _displayDayTwo() {
        alert("Day Two");
    }

    function _displayDayThree() {
        alert("Day Three");
    }

    function _displayDayFour() {
        alert("Day Four");
    }

    function _displayDayFive() {
        alert("Day Five");
    }

    exports.init = function () {
        _init();
    };    

    exports.toggleMetricTemp = function() {
        _toggleMetricTemp();
    };

    exports.display = function(location, current, forecasts) {
        _location = location;
        _currentWeather = current;
        _forecasts = forecasts;

        _display();
    };

    exports.displayDayOne = function () {
        _displayDayOne();
    };

    exports.displayDayTwo = function () {
        _displayDayTwo();
    };

    exports.displayDayThree = function () {
        _displayDayThree();
    };

    exports.displayDayFour = function () {
        _displayDayFour();
    };

    exports.displayDayFive = function () {
        _displayDayFive();
    };

    exports.CurrentWeather = function(dt, temp, imgUrl, weather, speed) {
        this.date = dt;
        this.temperature = temp;
        this.imgUrl = imgUrl;
        this.weather = weather;
        this.windSpeed = speed;
    };
    
    exports.Forecast = function (dt, imgUrl) {
        this.items = [];

        this.date = dt;
        this.imgUrl = imgUrl;
    };
});
