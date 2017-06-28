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

    var _dialog;

    var _location;
    var _currentWeather;
    var _forecasts = [];

    function _newForecastItem() {
        var item = {
            weekday: "",
            imgUrl: "",
            items: []
        };

        return item;
    }

    function _setDailyForecast(data) {
        var item;

        if (data.items.length <= 4) {
            item = data.items[0];
        } else {
            item = data.items[3];
        }

        data.weekday = _getDayOfWeek(item.date);
        data.imgUrl = item.weatherIcon;

        return data;
    }

    function _parseWeatherData(data) {
        _currentWeather = data.current;

        var currentDate = "";
        var currentDayForecast = null;

        data.forecast.forEach(function (item) {
            // Check if we need to move to the next forecast date
            var dt = item.dateText.substring(0, 10);

            if (currentDate !== dt) {
                if (currentDayForecast !== null) {
                    _forecasts.push(_setDailyForecast(currentDayForecast));
                }
                
                currentDayForecast = _newForecastItem();
                currentDate = dt;
            }
            
            currentDayForecast.items.push(item);
        });


    }

    function _init() {
        _locationID = $("#locationId");
        _currentImageID = $("#imgId");
        _currentTempID = $("#tempId");
        _currentWeatherID = $("#weatherId");
        _currentWindSpeedID = $("#windSpeedId");
        _dialog = $('#tempDialog');
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
        var imgUrl = "img/" + _currentWeather.weatherIcon + ".png";
        _currentImageID.attr("src", imgUrl);

        if (_useMetricTemp) {
            _currentTempID.text(_round(_currentWeather.temperature, 1) + " C");            
        } else {
            _currentTempID.text(_round(_toFahrenheit(_currentWeather.temperature), 1) + " F");
        }

        var knots = _round(_currentWeather.windSpeed * 1.943844, 2);
        _currentWindSpeedID.text("Wind Speed: " + knots + " knots");

        _currentWeatherID.text(_titleCase(_currentWeather.weatherDescription));

        // Show forecast icons
        var item = _forecasts[0];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayOneImage").attr("src", imgUrl);
        $("#dayOneDate").text(item.weekday);

        item = _forecasts[1];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayTwoImage").attr("src", imgUrl);
        $("#dayTwoDate").text(item.weekday);

        item = _forecasts[2];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayThreeImage").attr("src", imgUrl);
        $("#dayThreeDate").text(item.weekday);

        item = _forecasts[3];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayFourImage").attr("src", imgUrl);
        $("#dayFourDate").text(item.weekday);

        item = _forecasts[4];
        imgUrl = "img/" + item.imgUrl + ".png";
        $("#dayFiveImage").attr("src", imgUrl);
        $("#dayFiveDate").text(item.weekday);
    }

    function _toggleMetricTemp() {
        _useMetricTemp = !_useMetricTemp;
        _display();
    }

    function _displayDayOne() {
        _dialog.modal('show');
    }

    function _displayDayTwo() {
        _dialog.modal('show');
    }

    function _displayDayThree() {
        _dialog.modal('show');
    }

    function _displayDayFour() {
        _dialog.modal('show');
    }

    function _displayDayFive() {
        _dialog.modal('show');
    }

    exports.init = function () {
        _init();
    };    

    exports.toggleMetricTemp = function() {
        _toggleMetricTemp();
    };

    exports.display = function(location, weatherData) {
        _location = location;
        _parseWeatherData(weatherData);

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
});
