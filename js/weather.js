define(function (require, exports, module) {
    //jshint unused:false
    'use strict';

    function _getWeather(zip, countryCode, proc) {
        var forecast = [];
        var current;

        $.getJSON("data/currentWeather.json", function(data) {
            var forecast = [];
            var current;

            current = {
                date: new Date(data.dt * 1000),
                temperature: data.main.temp,
                weatherId: data.weather[0].id,
                weatherIcon: data.weather[0].icon,
                weatherDescription: data.weather[0].description,
                windSpeed: data.wind.speed
            };

            $.getJSON("data/weather.json", function(data) {
                var forecastData = data.list;

                forecastData.forEach(function (item) {
                    var forecastItem = {
                        date: new Date(item.dt * 1000),
                        dateText: item.dt_txt,
                        temperature: item.main.temp,
                        weatherId: item.weather[0].id,
                        weatherIcon: item.weather[0].icon,
                        weatherDescription: item.weather[0].description
                    };
                    
                    forecast.push(forecastItem);
                });

                var result = {
                    current: current,
                    forecast: forecast
                };

                if (typeof proc === "function") {
                    proc(result);
                }
            });            
        });
    }

    exports.getWeather = function(zip, countryCode, proc) {
        return _getWeather(zip, countryCode, proc);
    };
});