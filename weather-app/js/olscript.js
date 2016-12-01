function geo() {
  // geolocation object available?
  if (!navigator.geolocation) {
    $("#weather").html("<p class=\"flow-text\">Please update your browser. Our site is not working with it.</p>");
    return;
  }
  function success(pos) {
    var apiunit;
    var unit;
    if ($("#unit").text() === "°F") {
      apiunit = "metric";
      unit = " °C";
    } else {
      apiunit = "imperial";
      unit = " °F";
    }
    $.getJSON("https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat=" + pos.coords.latitude + "&lon=" + pos.coords.longitude + "&units=" + apiunit + "&APPID=dae492b9044e728c232337e86cceb2c0", function(data) {
      $("#weather").empty().append("<h3>" + data.name + ", " + data.sys.country + "</div>", "<h2><img src=\"https://crossorigin.me/http://openweathermap.org/img/w/" + data.weather[0].icon + ".png\" alt=\"" + data.weather[0].description + "\" title=\"" + data.weather[0].description + "\"> " + data.main.temp.toFixed(1) + unit + "</h2>", "<h4>" + data.weather[0].main + "</h4>");
      bgChange(data.weather[0].icon);
    });
    
  }
  function error() {
    $("#weather").html("<p class=\"flow-text\">Unable to retrieve your position.</p>");
  }
  function bgChange(icon) {
    var bgurl = "http://quantumconcepts.org/fcc/weather/";
    switch (icon.slice(0,2)) {
      case "01":
        bgurl += "clearsky.jpg";
        break;
      case "02":
        bgurl += "fewclouds.jpg";
        break;
      case "03":
        bgurl += "scatteredclouds.jpg";
        break;
      case "04":
        bgurl += "brokenclouds.jpg";
        break;
      case "09":
        bgurl += "showerrain.jpg";
        break;
      case "10":
        bgurl += "rain.jpg";
        break;
      case "11":
        bgurl += "thunderstorm.jpg";
        break;
      case "13":
        bgurl += "snow.jpg";
        break;
      case "50":
        bgurl += "mist.jpg";
        break;
    }
    bgurl = "url(" + bgurl + ")";
    $("body").css("background-image", bgurl);
  }
  navigator.geolocation.getCurrentPosition(success, error);
};

$(document).ready(function() {
  geo();
  $("#unit").click(function() {
    if ($(this).text() === "°F") {
      $(this).text("°C");
    } else {
      $(this).text("°F");
    }
    geo();
  });
});