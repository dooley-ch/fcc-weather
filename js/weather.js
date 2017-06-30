define(function (require, exports) {
    "use strict";

    var $ = require("jquery");
    
    /**
     * This function obtains the current weather and forecast data via
     * two calls to the openweathermap api:
     * https://openweathermap.org
     * 
     * @param {string}   zip                  - The zip code for the city 
     * @param {string}   countryCode          - The 2 letter ISO code for the country
     * @param {function(string, object)} done - A callback functon to return the data 
     * @return {void}
     */
    function _getWeather(zip, countryCode, done) {

        $.getJSON("data/currentWeather.json").done(function (currentData) {
            var current;

            current = {
                date: new Date(currentData.dt * 1000),
                temperature: currentData.main.temp,
                weatherId: currentData.weather[0].id,
                weatherIcon: currentData.weather[0].icon,
                weatherDescription: currentData.weather[0].description,
                windSpeed: currentData.wind.speed
            };

            $.getJSON("data/weather.json").done(function (forecastData) {
                var forecast = [];

                forecastData.list.forEach(function (item) {
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

                if (typeof done === "function") {
                    done(null, result);
                }

            }).fail(function () {
                return done("Unable to load forecase data", null);
            });

        }).fail(function () {
            return done("Unable to load current weather data", null);
        });
    }

    exports.getWeather = function(zip, countryCode, done) {
        return _getWeather(zip, countryCode, done);
    };
});