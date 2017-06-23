var geocoder;

var currentLocation;
var currentWeather;

var tempMode = 2;       // default to metric
var backgroundMode = 0  // Default background

function Location(city, zip, country, countryCode, latitude, longitude) {
    this.city = city;
    this.zip = zip;
    this.country = country;
    this.countryCode = countryCode;
    this.latitude = latitude;
    this.longitude = longitude;
}

function Weather(temp, pressure, humidity, windSpeed, windDegree, weatherId, weatherIcon, weatherLongDesc, weatherShortDesc, sunRise, sunSet) {
    this.temperature = temp;
    this.pressure = pressure;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.windDegree = windDegree;
    this.weatherId = weatherId;
    this.weatherIcon = weatherIcon;
    this.weatherLongDescription = weatherLongDesc;
    this.weatherShortDescription = weatherShortDesc;
    this.sunRise = sunRise;
    this.sunSet = sunSet;
}

//-----------------------------------------------------------------------------------------
//  Handle the change of background
//
function getBackgroundId() {
    var weatherId = Number(currentWeather.weatherId);

    switch(true) {
        case (weatherId >= 200) && (weatherId <= 232):
            return 1 // Thunderstorm
       case (weatherId >= 300) && (weatherId <= 321):
            return 2 // Drizzle
       case (weatherId >= 500) && (weatherId <= 531):
            return 3 // Rain
       case (weatherId >= 600) && (weatherId <= 622):
            return 4 // Snow
       case weatherId == 800:
            return 5 // Clear
       case (weatherId > 800) && (weatherId <= 804):
            return 6 // Clouds
       default:
            return 0;
    }
}

function updateBackground() {
    var newBackgroundId = getBackgroundId();

    if (newBackgroundId === backgroundMode) {
        return;
    }

    var oldClass = "background_" + backgroundMode;
    var newClass = "background_" + newBackgroundId;

    var target = $("#backgroundImage");

    $("#backgroundImage").toggleClass(oldClass, false);
    target.toggleClass(newClass, true);
}
//-----------------------------------------------------------------------------------------
//  Display data
//
function titleCase(str) {
    var newstr = str.split(" ");

    for(i=0; i<newstr.length; i++){ 
        if(newstr[i] == "") continue;
        var copy = newstr[i].substring(1).toLowerCase();
        newstr[i] = newstr[i][0].toUpperCase() + copy;
    }

    newstr = newstr.join(" ");
    
    return newstr;
}  

function displayLocation() {
    var location = "(" + currentLocation.city + ", " + currentLocation.country + ")";

    $("#currentLocation").text(location);
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function displayWeather() {
    $("#weather").text(titleCase(currentWeather.weatherLongDescription));

    if (tempMode == 2) {
        $("#temperature").text(round(currentWeather.temperature, 1) + " C");
    } else {
        $("#temperature").text(round(toFahrenheit(currentWeather.temperature), 1) + " F");
    }

    var knots = round(currentWeather.windSpeed * 1.943844, 2);
    $("#windspeed").text("Wind Speed: " + knots + " knots");

    var imageUrl = "img/" + currentWeather.weatherIcon + ".png";
    $("#weatherImage").attr("src", imageUrl);

    updateBackground();
}

//-----------------------------------------------------------------------------------------
//  Changing temp display
//
function onTempFormatChange(e) {
  if (tempMode === 1) {
    this.innerHTML = "<i class=\"fa fa-thermometer-full\"></i> Imperial";
    tempMode = 2;
  } else {
    this.innerHTML = "<i class=\"fa fa-thermometer-full\"></i> Metric";
    tempMode = 1;    
  }  

  displayWeather();
}

function toFahrenheit(value) {
    return (value * (9/5)) + 32;
}

//-----------------------------------------------------------------------------------------
//  Get location information
//
function geoSuccess(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    

    var latlng = new google.maps.LatLng(latitude, longitude);
  
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            data = results[0].address_components;

            var city = data[2].long_name;
            var country = data[5].long_name;
            var countryCode = data[5].short_name.toLowerCase();
            var zip = data[6].long_name;

            currentLocation = new Location(city, zip, country, countryCode, latitude, longitude);

            displayLocation();

            getWeather();
        }
    });
}

function geoError() {
  alert("If you receive this message it means that the page has not been able update the weather status automatically.\n" +
        "Please try using the refresh button to obtain the weather status, answering yes to allow the system to obtain your location.");
}

function getLocation() {
    if (!navigator.geolocation){
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

//-----------------------------------------------------------------------------------------
//  Get current weather
//
function getWeather() {
    var weatherLink = "http://api.openweathermap.org/data/2.5/weather?zip=" 
        + currentLocation.zip + "," + currentLocation.countryCode + "&units=metric&APIKEY=7f39210ab87154b09c8ed5ed76fb8d3a";

    $.getJSON(weatherLink, function(data) {
        var temp = data.main.temp;
        var pressure = data.main.pressure;
        var humidity = data.main.humidity;

        var windSpeed = data.wind.speed;
        var windDegree = data.wind.deg;

        var weatherId = data.weather[0].id;
        var weatherIcon = data.weather[0].icon;
        var weatherLongDesc = data.weather[0].description;
        var weatherShortDesc = data.weather[0].main;
        
        var sunRise = new Date(data.sys.sunrise * 1000);
        var sunSet = new Date(data.sys.sunset * 1000);

        currentWeather = new Weather(temp, pressure, humidity, windSpeed, windDegree, weatherId, weatherIcon, weatherLongDesc, weatherShortDesc, sunRise, sunSet);

        displayWeather();
    });
}

//-----------------------------------------------------------------------------------------
//  Handle refresh button
//
function onRefresh(e) {
    getLocation();
}

//-----------------------------------------------------------------------------------------
//  Entry Point
//
$(function () {
    $(window).on("load resize", function () {
        $(".fill-screen").css("height", window.innerHeight);
    });

    $("#tempButton").click(onTempFormatChange);
    $("#refreshButton").click(onRefresh);

    geocoder = new google.maps.Geocoder();

    getLocation(); // A change of location also causes a weather update.
});