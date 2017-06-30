define(function (require, exports) {
    "use strict";

    var $ = require("jquery");
    
    /**
     * This function builds the URL used to obtain the weather data
     * 
     * @param {object} loc - location data 
     * @param {string} requestType - request type weather or forecast
     * @returns {string}
     */
    function _buildWeatherUrl(loc, requestType) {
        if (loc.hasOwnProperty("location")) {
            return "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/" + requestType + "?zip=" +
                loc.zip + "," + loc.countryCode + "&units=metric&APIKEY=7f39210ab87154b09c8ed5ed76fb8d3a";
        } else {
            return "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/" + requestType + "?lat=" + loc.latitude + 
                "&lon=" + loc.longitude + "&units=metric&APIKEY=7f39210ab87154b09c8ed5ed76fb8d3a";
        }
    }
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
    function _getWeather(loc, done) {
        $.getJSON(_buildWeatherUrl(loc, "weather")).done(function (currentData) {
            var current;
            var forecast = [];

            current = {
                date: new Date(currentData.dt * 1000),
                temperature: currentData.main.temp,
                weatherId: currentData.weather[0].id,
                weatherIcon: currentData.weather[0].icon,
                weatherDescription: currentData.weather[0].description,
                windSpeed: currentData.wind.speed
            };

            $.getJSON(_buildWeatherUrl(loc, "forecast")).done(function (forecastData) {
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
                    location: "",
                    current: current,
                    forecast: forecast
                };
                if (loc.hasOwnProperty("location")) {
                    result.location = loc.location;

                    return done(null, result);
                }
            
                $.getJSON("data/country_names.json").done(function (countryData) {
                    var countryName = countryData[forecastData.city.country];
                    result.location = forecastData.city.name + ", " + countryName;

                    return done(null, result);
                }).fail(function () {
                    result.location = forecastData.city.name + ", " + forecastData.city.country;

                    return done(null, result);               
                });
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