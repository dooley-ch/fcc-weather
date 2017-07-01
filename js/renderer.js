define(function (require, exports) {
    "use strict";

    var $ = require("jquery");

    var _backgroundMode = 0;
    var _useMetric = true;
    var _weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    var _location;
    var _currentWeather;
    var _forecasts = [];

    /**
     * This functin determines the background to use
     * based on the current weather id
     * 
     * @param {number} weatherId - the current weather id 
     * @returns {number} - image id to use as background
     */
    function _getBackgroundId(weatherId) {
        switch(true) {
        case (weatherId >= 200) && (weatherId <= 232):
            return 1; // Thunderstorm
        case (weatherId >= 300) && (weatherId <= 321):
            return 2; // Drizzle
        case (weatherId >= 500) && (weatherId <= 531):
            return 3; // Rain
        case (weatherId >= 600) && (weatherId <= 622):
            return 4; // Snow
        case weatherId == 800:
            return 5; // Clear
        case (weatherId > 800) && (weatherId <= 804):
            return 6; // Clouds
        default:
            return 0;
        }
    }

    /**
     * This function updates the page background based on the current weather id
     * 
     * @returns {void}
     */
    function _updateBackground() {
        var newBackgroundId = _getBackgroundId(Number(_currentWeather.weatherId));

        if (newBackgroundId === _backgroundMode) {
            return;
        }

        var oldClass = "background_" + _backgroundMode;
        var newClass = "background_" + newBackgroundId;

        $("#backgroundImage").toggleClass(oldClass, false);
        $("#backgroundImage").toggleClass(newClass, true);

        _backgroundMode = newBackgroundId;
    }

    /**
     * Creates an object literal that is used to store a daily forecast
     * 
     * @returns {{weekday: string, imgUrl: string, items:[]}}
     */
    function _newForecastItem() {
        var item = {
            weekday: "",
            imgUrl: "",
            items: []
        };

        return item;
    }

    /**
     * Sets the mid point of the 3 hourly forecast to be the 
     * daily forecast.
     * 
     * @param {object} data - The forecast item that needs to have the daily forecase set 
     * @return {void}
     */
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

    /**
     * This function converts the forecast data obtained from the remote site 
     * into a format to be used for display purposes
     * 
     * @param {object} data - The returned forecast data 
     * @return {void}
     */
    function _parseWeatherData(data) {
        _useMetric = data.usesMetric;
        _location = data.location;
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

        if ((_forecasts.length === 4) && (currentDayForecast.items.length === 8)) {
            // Handle exceptional case where we get exactly 5 days forecast
            _forecasts.push(_setDailyForecast(currentDayForecast));
        }
    }

    /**
     * This function populates and displays the forecast dialog
     * 
     * @param {number} column - The forecast day as an array index 
     * @return {void}
     */
    function _showForecastDialog(column) {
        var tableContents;
        var item = _forecasts[column];

        if (item) {
            $("#dialogTitle").text(item.items[0].date.toLocaleDateString());

            tableContents = "<table class=\"table table-striped table-condensed\">";
            
            $.each(item.items, function (i, item) {
                var row = "<tr>";

                row = row + "<td class=\"dlg-time\">" + item.date.toLocaleTimeString().substring(0, 5) + "</td>";
                row = row + "<td><img src=\"img/" + item.weatherIcon + ".png\" class=\"dlg-img\"/></td>";

                if (_useMetric) {
                    row = row + "<td class=\"dlg-temp\">" + item.temperature + " C</td>";
                } else {
                    row = row + "<td class=\"dlg-temp\">" + _round(_toFahrenheit(item.temperature), 1) + " F</td>";
                }

                row = row + "<td class=\"dlg-desc\">" + item.weatherDescription + "</td>";
                
                row = row + "</tr>";

                tableContents = tableContents + row;
            });

            tableContents = tableContents + "</table>";

            $("#tableGrid").html(tableContents);
            
            $("#tempDialog").modal("show");
        }
    }

    /**
     * This function returns the short day name for the given date
     * 
     * @param {Date} dt  - The date for which the short name is required
     * @returns {string} - The short day name for the date
     */
    function _getDayOfWeek(dt) {
        return _weekdays[dt.getDay()];
    }

    /**
     * This function upper cases the first letter of each word
     * 
     * @param {string} str - The string to title case 
     * @returns {string}   - The title cased string
     */
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

    /**
     * This function rounds a given float to a given number of decimal places
     * 
     * @param {number} value    - The number to round
     * @param {number} decimals - The number of required places after the decimal
     * @returns {number}        - The rounded value
     */
    function _round(value, decimals) {
        return Number(Math.round(value+"e"+decimals)+"e-"+decimals);
    }

    /**
     * This function converts a celsius value to it's fahrenheit value
     * 
     * @param {number} value - the celsius value to convert
     * @returns {number}     - the converted value
     */
    function _toFahrenheit(value) {
        return (value * (9/5)) + 32;
    }

    /**
     * Displays the current weather data on the page
     * 
     * @return {void}
     */
    function _display() {
        // Show the location
        $("#locationId").text("(" + _location + ")");

        // Show the current weather
        var imgUrl = "img/" + _currentWeather.weatherIcon + ".png";
        $("#imgId").attr("src", imgUrl);

        if (_useMetric) {
            $("#tempId").text(_round(_currentWeather.temperature, 1) + " C");            
        } else {
            $("#tempId").text(_round(_toFahrenheit(_currentWeather.temperature), 1) + " F");
        }

        var knots = _round(_currentWeather.windSpeed * 1.943844, 2);
        $("#windSpeedId").text("Wind Speed: " + knots + " knots");

        $("#weatherId").text(_titleCase(_currentWeather.weatherDescription));

        // Show forecast icons
        var item = _forecasts[0];
        if (item) {
            imgUrl = "img/" + item.imgUrl + ".png";
            $("#dayOneImage").attr("src", imgUrl);
            $("#dayOneDate").text(item.weekday);
        } else {
            $("#dayOneImage").attr("src", "");
            $("#dayOneDate").text("NA");
        }

        item = _forecasts[1];
        if (item) {
            imgUrl = "img/" + item.imgUrl + ".png";
            $("#dayTwoImage").attr("src", imgUrl);
            $("#dayTwoDate").text(item.weekday);
        } else {
            $("#dayTwoImage").attr("src", "");
            $("#dayTwoDate").text("N/A");
        }

        item = _forecasts[2];
        if (item) {
            imgUrl = "img/" + item.imgUrl + ".png";
            $("#dayThreeImage").attr("src", imgUrl);
            $("#dayThreeDate").text(item.weekday);
        } else {
            $("#dayThreeImage").attr("src", "");
            $("#dayThreeDate").text("N/A");
        }

        item = _forecasts[3];
        if (item) {
            imgUrl = "img/" + item.imgUrl + ".png";
            $("#dayFourImage").attr("src", imgUrl);
            $("#dayFourDate").text(item.weekday);
        } else {
            $("#dayFourImage").attr("src", "");
            $("#dayFourDate").text("N/A");            
        }

        item = _forecasts[4];
        if (item) {
            imgUrl = "img/" + item.imgUrl + ".png";
            $("#dayFiveImage").attr("src", imgUrl);
            $("#dayFiveDate").text(item.weekday);
        } else {
            $("#dayFiveImage").attr("src", "");
            $("#dayFiveDate").text("N/A");            
        }
    
        $("#masterPanel").toggleClass("hidden", false);

        // Update page background
        _updateBackground();
    }

    /**
     * Toggles the metric temperature flag and redisplays the data
     * 
     * @return {void}
     */
    function _toggleMetricTemp() {
        _useMetric = !_useMetric;
        _display();
    }

    exports.toggleMetricTemp = function() {
        _toggleMetricTemp();
    };

    exports.display = function(weatherData) {
        _parseWeatherData(weatherData);

        _display();
    };

    exports.displayForecast = function (column) {
        _showForecastDialog(column);
    };
});
