//-----------------------------------------------------------------------------------------
//  Entry Point
//
$(function () {
    $(window).on("load resize", function () {
        $(".fill-screen").css("height", window.innerHeight);
    });

    geocoder = new google.maps.Geocoder();
});