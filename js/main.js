var currentPosition;
var currentWeather;

var rawLocation;
var rawWeather;

function Location(status, city, zip, region, country, countryCode, latitude, longitude) {
    this.status = status;
    this.city = city;
    this.zip = zip;
    this.region = region;
    this.country = country;
    this.countryCode = countryCode;
    this.latitude = latitude;
    this.longitude = longitude;
}

function getWeather() {
    $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
        currentPosition = new Location(data.status, data.city, data.zip, data.region, data.country, data.countryCode, data.lat, data.lon);
        rawLocation.text(JSON.stringify(data));

        var weatherLink = "http://api.openweathermap.org/data/2.5/weather?zip=" 
            + currentPosition.zip + "," + currentPosition.countryCode.toLowerCase() + "&units=metric&APIKEY=7f39210ab87154b09c8ed5ed76fb8d3a";

        $.getJSON(weatherLink, function(data) {
            rawWeather.text(JSON.stringify(data));
        });
    });
}

$(function () {
    $(window).on("load resize", function () {
        $(".fill-screen").css("height", window.innerHeight);
    });

    rawLocation = $("#rawLocation");
    rawWeather =  $("#rawWeather");

    getWeather();
});