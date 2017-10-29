function App() {
    let _weatherService,
        _weatherElement,
        //Stores WOEIDs
        _cities = {
            "Ghent": 12591774,
            "Brussels": 968019,
            "Amsterdam": 727232,
            "New York": 2459115,
            "Kourou": 379833,
            "Seoul": 1132599,
            "Cape Canaveral": 2374623,
            "Sydney": 1105779,
            
        }

    function init() {
        _weatherElement = document.querySelector('.weather_cards');
        loadWeatherData();
        //Refreshes parking states every 2.5 minutes
    }

    function loadWeatherData() {
        let currentWeather;
        for (let city in _cities) {
            _weatherService = new WeatherService(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D${_cities[city]}%20AND%20u%3D%22c%22&format=json&diagnostics=true`);
            _weatherService.loadWeather()
            .then(function(data) {
                let currentWeather = data;
                catchUndefined(data, city);
            })
            .catch(function(reject) {
                throw new Error(reject);
            });
        }
    }
    function catchUndefined(data, city) {
        let weather = data;
        if (!weather.query.results.channel.item.condition.temp) {
            weather.query.results.channel.item.condition.temp = '?';
        }
        if (!weather.query.results.channel.wind.speed) {
            weather.query.results.channel.wind.speed = '?';
        }
        if (!weather.query.results.channel.wind.direction) {
            weather.query.results.channel.wind.direction = '?';
        }
        updateWeatherCard(weather, city);
    }
    function updateWeatherCard(weather, city) {
        let tempStr = '';
        tempStr += 
        `
        <div class="demo-card-square mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title mdl-card--expand ${setConditionImage(weather.query.results.channel.item.condition.text)}">
                <h2 class="mdl-card__title-text">${city} <span class="weather-card__quick-info">${weather.query.results.channel.item.condition.temp + '°' + weather.query.results.channel.units.temperature} | <img class="weather-card__quick-info-icon" src="assets/icons/${setConditionIcon(weather.query.results.channel.item.condition.text)}"></span></h2>
            </div>
            <div class="mdl-card__supporting-text">
                <ul class="weather-card__list info-list">
                    <li>Temperature: <span class="weather-card__list-value">${weather.query.results.channel.item.condition.temp + '°' + weather.query.results.channel.units.temperature}</span</li>
                    <li>Humidity: <span class="weather-card__list-value">${weather.query.results.channel.atmosphere.humidity}%</span</li>
                </ul>
                <ul class="weather-card__list info-list">
                    <li>Wind direction: <span class="weather-card__list-value">${getWindDirection(weather.query.results.channel.wind.direction)}</span</li>
                    <li>Wind speed: <span class="weather-card__list-value">${Math.round(weather.query.results.channel.wind.speed) + weather.query.results.channel.units.speed}</span</li>
                </ul>
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <ul class="weather-card__list forecast-list">
                    ${checkForecast(weather)}
                </ul>
            </div>
        </div>
        `
        _weatherElement.innerHTML += tempStr;
    }
    function checkForecast(weather) {
        let returnStr = '';
        if (weather.query.results.channel.item.forecast.length) {
            //Only 5 of 10 forecasts are shown
            for (let i = 0; i < 5; i++) {
                returnStr +=
                `
                <li class="forecast-list__item">
                    <div>
                        <p class="forecast-list__item-p">${weather.query.results.channel.item.forecast[i].day}</p>
                        <img class="forecast-list__item-icon" src="assets/icons/${setConditionIcon(weather.query.results.channel.item.forecast[i].text)}">
                        <p class="forecast-list__item-p">${weather.query.results.channel.item.forecast[i].low + '°' + weather.query.results.channel.units.temperature}</p>
                    </div>
                </li>
                `
            }
        }
        return returnStr;
    }
    //Converts angle to wind direction
    //TODO: Add additional values: NW, SW, ...
    function getWindDirection(windDirection) {
        if (windDirection > 0 && windDirection <= 90) {
            return "E"
        }
        else if (windDirection > 90 && windDirection <= 180) {
            return "N"
        }
        else if (windDirection > 180 && windDirection <= 270) {
            return "W"
        }
        else if (windDirection > 270 && windDirection <= 360) {
            return "S"
        }
    }
    function setConditionImage (weatherCondition) {
        let conditionImage;
        switch (weatherCondition) {
            case "Cloudy":
                conditionImage = "bg-cloudy";
                break;
            case "Mostly Cloudy":
            case "Partly Cloudy":
                conditionImage = "bg-mostlycloudy";
                break;
            case "Hot":
            case "Sunny":
            case "Clear":
            case "Mostly Sunny":
                conditionImage = "bg-sunny";
                break;
            case "Snow":
            case "Heavy Snow":
            case "Snow Showers":
            case "Blowing Snow":
            case "Snow Flurries":
                conditionImage = "bg-snow";
                break;
            case "Rain":
            case "Showers":
            case "Drizzle":
            case "Freezing Rain":
            case "Scattered Showers":
                conditionImage = "bg-rain";
                break;
            case "Thunderstorms":
            case "Isolated Thunderstorms":
            case "Scattered thunderstorms":
                conditionImage = "bg-thunderstorm";
                break;
            case "Foggy":
            case "Hazy":
            case "Smoky":
            case "Dust":
                conditionImage = "bg-cloudy";
                break;
            case "Windy":
            case "Breezy":
                conditionImage = "bg-cloudy";
                break;
            default:
                //Not ideal, but meh. Correct 60% of the time anyway
                conditionImage = "bg-cloudy";
        }
        return conditionImage;
    }
    function setConditionIcon(weatherCondition) {
        let conditionIcon = '';
        //TODO: Set background image of card to appropriate weather type //background: url('../background-images/Cloudy.jpg') bottom right 15% no-repeat #46B6AC;
        switch (weatherCondition) {
            case "Cloudy":
                conditionIcon = "Cloud.svg";
                break;
            case "Mostly Cloudy":
            case "Partly Cloudy":
                conditionIcon = "Cloud-Sun.svg";
                break;
            case "Hot":
            case "Sunny":
            case "Clear":
            case "Mostly Sunny":
                conditionIcon = "Sun.svg";
                break;
            case "Snow":
            case "Heavy Snow":
            case "Snow Showers":
            case "Blowing Snow":
            case "Snow Flurries":
                conditionIcon = "Cloud-Snow-Alt.svg";
                break;
            case "Rain":
            case "Showers":
            case "Drizzle":
            case "Freezing Rain":
            case "Scattered Showers":
                conditionIcon = "Cloud-Drizzle.svg";
                break;
            case "Thunderstorms":
            case "Isolated Thunderstorms":
            case "Scattered thunderstorms":
                conditionIcon = "Cloud-Lightning.svg";
                break;
            case "Foggy":
            case "Hazy":
            case "Smoky":
            case "Dust":
                conditionIcon = "Cloud-Fog.svg";
                break;
            case "Windy":
            case "Breezy":
                conditionIcon = "Cloud-Wind.svg";
                break;
            default:
                //Not ideal, but meh. Correct 60% of the time anyway
                conditionIcon = "Cloud.svg";
        }
        return conditionIcon;
    }
    return {
        init: init
    }
}

// load event window object
// all resources are loaded
window.addEventListener('load', function(ev) {
    // Make new instance of app
    const app = new App();
    app.init();
});