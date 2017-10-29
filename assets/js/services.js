function WeatherService(URL) {
    function loadWeather() {
        return AJAX.loadJsonByPromise(URL);
    }
    return {
        loadWeather: loadWeather
    }
};