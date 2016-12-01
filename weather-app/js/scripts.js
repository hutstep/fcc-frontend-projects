// Loading effect - change dot color
(function () {
  var dots = document.getElementById('dots').children,
    count = 0,
    mainColor = '#000',
    activeColor = '#F44336';
  intId = setInterval(function () {
    if (count === 0) {
      dots[dots.length - 1].style.color = mainColor;
    } else {
      dots[count - 1].style.color = mainColor;
    }
    dots[count].style.color = activeColor;
    count = count === (dots.length - 1) ? 0 : count + 1;
  }, 800);
})();

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Get user ip.
(function () {
  var xhr = createCORSRequest('GET', 'https://freegeoip.net/json/');
  if (!xhr) {
    throw new Error('CORS not supported');
  }
  xhr.onload = function () {
    var geoData = JSON.parse(xhr.responseText);
    getWeatherData(geoData.latitude, geoData.longitude);
  };
  xhr.onerror = function () {
    alert('Woops, there was an error making the ip request.');
  };
  xhr.send();
})();

function getWeatherData(lat, lon) {
  var xhr = createCORSRequest(
    'GET',
    'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&APPID=dae492b9044e728c232337e86cceb2c0'
  );
  if (!xhr) {
    throw new Error('CORS not supported');
  }
  xhr.onload = function () {
    useData(JSON.parse(xhr.responseText));
  };
  xhr.onerror = function () {
    alert('Woops, there was an error making the weather data request.');
  };
  xhr.send();
}

function useData(data) {
  // change background image according to weather
  var icons = {
      '01': 'clearsky.jpg',
      '02': 'fewclouds.jpg',
      '03': 'scatteredclouds.jpg',
      '04': 'brokenclouds.jpg',
      '09': 'showerrain.jpg',
      '10': 'rain.jpg',
      '11': 'thunderstorm.jpg',
      '13': 'snow.jpg',
      '50': 'mist.jpg'
    },
    bgUrl = 'img/' + icons[data.weather[0].icon.slice(0, 2)];
  document.body.style.backgroundImage = 'url(' + bgUrl + ')';

  // set user location
  var locationEle = document.getElementById('location'),
    locText = data.name + ', ' + data.sys.country;
  locationEle.textContent = locText;
  locationEle.style.display = 'block';

  // set user temperature
  var tempCelsius = data.main.temp,
    tempEle = document.getElementById('temp');
  tempEle.textContent = tempCelsius.toFixed(1) + ' °C';

  // set the right weather icon
  var icon = document.createElement('img'),
    iconSrc = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
  icon.setAttribute('src', iconSrc);
  icon.setAttribute('alt', data.weather[0].description);
  icon.setAttribute('title', data.weather[0].description);
  tempEle.insertAdjacentElement('afterbegin', icon);
  tempEle.style.display = 'block';

  // deactivate and hide dots
  clearInterval(intId);
  document.getElementById('dots').style.display = 'none';

  // set weather condition text
  document.getElementById('weather').textContent = data.weather[0].main;

  // change unit - button logic
  var unit = 'c';
  document.getElementById('switch').onclick = function () {
    if (unit === 'c') {
      this.textContent = '°C';
      unit = 'f';
      tempEle.lastChild.textContent = (tempCelsius * 1.8 + 32).toFixed(1) + ' °F';
    } else {
      this.textContent = '°F';
      unit = 'c';
      tempEle.lastChild.textContent = tempCelsius.toFixed(1) + ' °C';
    }
  };
}