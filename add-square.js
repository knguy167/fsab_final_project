/* document.getElementById('addImg').addEventListener('click', addSquare); */

/* const { json } = require("stream/consumers"); */

/* const { getRawAsset } = require("node:sea"); */

const cityInput = document.querySelector(".cityInput");
const apiKey = '8c3eaf363d74866d609b6e2b8b455d2c';

document.getElementById('addImg').addEventListener('click', async event =>{
    
    const city = cityInput.value;

    if (city) {
        try{
            const cityData = await getCityData(city);
            const laterData = await getLaterData(cityData);
            const nowData = await getNowData(city);
            addSquare(nowData, laterData);
        }
        catch(error){
            console.error(error);
            alert("error occurred");
        }
    }
    else {
        alert("Please enter a city");
    }
});

async function getCityData(city) {
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl)
    
    console.log(response);
    const jsonResponse = await response.json();
    console.log(jsonResponse);

    if(!response.ok) {
        throw new Error("couldn't fetch city data");
    }

    console.log(jsonResponse[0].lat);
    return([jsonResponse[0].lat, jsonResponse[0].lon]);
    }

async function getNowData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    
    const response = await fetch(apiUrl);
    

    if(!response.ok) {
        throw new Error("couldn't fetch weather data");
    }

    return await response.json();
}

async function getLaterData(cords){
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cords[0]}&lon=${cords[1]}&appid=${apiKey}`
    
    const response = await fetch(apiUrl);
    

    if(!response.ok) {
        throw new Error("couldn't fetch weather data");
    }

    return await response.json();
}

function kToF (kelvin){
    return 1.8 * (kelvin -273.15) + 32
}

function numToDate(dayNum) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayNum % 7];
}

function hourConvert(hour) {
    hour = hour % 24;
    if (hour == 0) {
        return "12 AM";
    }
    else if (hour == 12) {
        return "12 PM";
    }
    else if (hour <= 11) {
        return ((hour).toString() + " AM");
    }
    else {
        return ((hour - 12).toString() + " PM");
    }
}

function weatherIcon(id) {
    console.log(id);
    switch(true) {
        case (id <= 200):
            return '⛈️';
        case (id <= 300):
            return '🌧️';
        case (id <= 600):
            return '🌧️';
        case (id <= 700):
            return '❆';
        case (id == 800):
            return '☀️';
        case (id > 800):
            console.log('hi');
            return '☁︎';
    }
    console.log(id);
    
}

function addSquare (nowData, laterData) {
    
    const {name: city, 
           main: {temp, temp_min, temp_max, humidity}, 
           weather: [{main, id}]} = nowData;

    const now = new Date();
    const currentHour = now.getHours();
    
    const template = document.getElementById("weatherTemplate");

    const newWeatherDiv = template.cloneNode(true);
    newWeatherDiv.style.display = 'grid';
    
    newWeatherDiv.querySelector('.location').textContent = city;
    newWeatherDiv.querySelector('.weather-icon').textContent = weatherIcon(id);
    newWeatherDiv.querySelector('.now-temperature').textContent = `${kToF(temp).toFixed(0)}°`;
    newWeatherDiv.querySelector('.weather-word').textContent = main;
    newWeatherDiv.querySelector('.high-low').textContent = `H: ${kToF(temp_max).toFixed(0)} L: ${kToF(temp_min).toFixed(0)}`;

    const date = new Date(laterData.list[0].dt*1000);
    const hours = date.getHours();

    newWeatherDiv.querySelector('.one-hr-time').textContent = hourConvert(hours);
    newWeatherDiv.querySelector('.two-hr-time').textContent = hourConvert(currentHour + 2);
    newWeatherDiv.querySelector('.three-hr-time').textContent = hourConvert(currentHour + 3);
    /* newWeatherDiv.querySelector('.four-hr-time').textContent = hourConvert(currentHour + 4);
    newWeatherDiv.querySelector('.five-hr-time').textContent = hourConvert(currentHour + 5);
    newWeatherDiv.querySelector('.six-hr-time').textContent = hourConvert(currentHour + 6); */

    newWeatherDiv.querySelector('.one-hr-icon').textContent = "S";
    newWeatherDiv.querySelector('.two-hr-icon').textContent = "S";
    newWeatherDiv.querySelector('.three-hr-icon').textContent = "S";
    /* newWeatherDiv.querySelector('.four-hr-icon').textContent = "S";
    newWeatherDiv.querySelector('.five-hr-icon').textContent = "S";
    newWeatherDiv.querySelector('.six-hr-icon').textContent = "S"; */

    newWeatherDiv.querySelector('.one-hr-degree').textContent = "70";
    newWeatherDiv.querySelector('.two-hr-degree').textContent = "69";
    newWeatherDiv.querySelector('.three-hr-degree').textContent = "68";
    /* newWeatherDiv.querySelector('.four-hr-degree').textContent = "67";
    newWeatherDiv.querySelector('.five-hr-degree').textContent = "66";
    newWeatherDiv.querySelector('.six-hr-degree').textContent = "65"; */

    newWeatherDiv.querySelector('.one-day').textContent = numToDate(now.getDate() + 1);
    newWeatherDiv.querySelector('.two-day').textContent = numToDate(now.getDate() + 2);
    newWeatherDiv.querySelector('.three-day').textContent = numToDate(now.getDate() + 3);
    newWeatherDiv.querySelector('.four-day').textContent = numToDate(now.getDate() + 4);
    newWeatherDiv.querySelector('.five-day').textContent = numToDate(now.getDate() + 5);

    newWeatherDiv.querySelector('.one-forecast').textContent = "S";
    newWeatherDiv.querySelector('.two-forecast').textContent = "S";
    newWeatherDiv.querySelector('.three-forecast').textContent = "S";
    newWeatherDiv.querySelector('.four-forecast').textContent = "S";
    newWeatherDiv.querySelector('.five-forecast').textContent = "S";

    newWeatherDiv.querySelector('.one-low').textContent = '62';
    newWeatherDiv.querySelector('.two-low').textContent = '62';
    newWeatherDiv.querySelector('.three-low').textContent = '62';
    newWeatherDiv.querySelector('.four-low').textContent = '62';
    newWeatherDiv.querySelector('.five-low').textContent = '62';

    newWeatherDiv.querySelector('.one-range').textContent = '---------------';
    newWeatherDiv.querySelector('.two-range').textContent = '---------------';
    newWeatherDiv.querySelector('.three-range').textContent = '---------------';
    newWeatherDiv.querySelector('.four-range').textContent = '---------------';
    newWeatherDiv.querySelector('.five-range').textContent = '---------------';

    newWeatherDiv.querySelector('.one-high').textContent = '70';
    newWeatherDiv.querySelector('.two-high').textContent = '70';
    newWeatherDiv.querySelector('.three-high').textContent = '70';
    newWeatherDiv.querySelector('.four-high').textContent = '70';
    newWeatherDiv.querySelector('.five-high').textContent = '70';

    const weatherGrid = document.getElementById("weatherGrid");
    var addDiv = document.getElementById('add');
    weatherGrid.insertBefore(newWeatherDiv, addDiv);
}
