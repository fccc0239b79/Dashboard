'use strict';

window.addEventListener('load', setup);

var weather;
var input;

var api = 'http://api.apixu.com/v1/forecast.json?key=';
var apiKey = 'c68da5f0e9494019bcc124437170603&q=';
//var city = 'Portsmouth';
var daysNo = '&days=4';


function setup() {
  ///var x = input.value();
    //var url = "http://api.apixu.com/v1/forecast.json?key=c68da5f0e9494019bcc124437170603&q=Portsmouth&days=4"
    var url = api + apiKey + "Portsmouth" + daysNo;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            getData(JSON.parse(xhr.responseText));
        } else {
            document.querySelector('body > main').innerHTML = 'sorry, something went wrong...';
        }
    }
    xhr.send();



}

//document.getElementById("town").addEventListener("click", myCity);



function getData(data) {

    weather = data;

    var icon = document.getElementById('icon');
    icon.src = weather.current.condition.icon;

    var message = document.getElementById('message');
    message.textContent = weather.current.condition.text;

    var town = document.getElementById('town');
    town.textContent = weather.location.name;

    var todayTemp = document.getElementById('todayTemp');
    todayTemp.textContent = weather.current.temp_c + '\xB0C';

    addElementsToWeatherPanel();



    //  console.log(orecast.splice(0,1));

}

function addElementsToWeatherPanel() {
    var index = 0;
    var forecast = weather.forecast.forecastday;

    forecast.splice(0, 1);
    forecast.forEach(function(d) {
      //v  console.log(d);

    //    console.log(d.date);
        //    console.log(d.day.maxtemp_c);

        ////////////////////////////////////////////////////////////
        var q = document.getElementById('tomorrowDay' + index);
        //  q.textContent = days[d.date];
        q.innerHTML = d.date;


        var w = document.getElementById('icon' + index);
        w.src = d.day.condition.icon;

        var e = document.getElementById('futureMessage' + index);
        e.textContent = d.day.condition.text;

        var r = document.getElementById('futureTemp' + index);
        r.textContent = d.day.avgtemp_c + '\xB0C';

        weatherBackgrounds(index);
        index++;

    });

}


function weatherBackgrounds(index) {

    var time = new Date();
    var hours = time.getHours();

    if (hours >= 20 && hours <= 24) {
        document.getElementById('weatherPanel').style.backgroundImage = "url('images/evening.jpg')";
    } else if (hours <= 6) {
        document.getElementById('weatherPanel').style.backgroundImage = "url('images/night.jpg')";
    } else if (hours >= 6 && hours <= 12) {
        document.getElementById('weatherPanel').style.backgroundImage = "url('images/morning.jpg')";
    } else {
        document.getElementById('weatherPanel').style.backgroundImage = "url('images/afternoon.jpg')";
    }

}
