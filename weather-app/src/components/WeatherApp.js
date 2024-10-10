import React, { useState, useEffect } from "react";
import "./../styles/style.css"; // CSS import

const WeatherApp = () => {
  const [city, setCity] = useState("Leipzig");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch weather data
  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch geolocation for the city
      const geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=921e1dd6b430659e204ccb6dd0e64323`
        // `http://api.openweathermap.org/geo/1.0/direct?q=${city},DE&limit=5&appid=921e1dd6b430659e204ccb6dd0e64323`
      );
      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        setError("City not found");
        setLoading(false);
        return;
      }

      const { lat, lon } = geoData[0];

      // Fetch weather data using latitude and longitude
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=921e1dd6b430659e204ccb6dd0e64323`
      );
      const weather = await weatherResponse.json();
      setWeatherData(weather);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  return (
    <div className="weather-app">
      <nav className="navbar">
        <h1 className="navbar-brand">Weather UB</h1>
      </nav>

      <div className="container">
        <h2>Weather in {city}</h2>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeatherData}>Search</button>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {weatherData && (
        <div className="weather-info">
    <h3>{weatherData.name}</h3>
    <p>{weatherData.weather[0].description}</p>
    
    <h1>
      {weatherData.main.temp} <sup>°C</sup> / 
      {((weatherData.main.temp * 9) / 5 + 32).toFixed(1)} <sup>°F</sup>
    </h1>
    
    <div className="details">
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Wind Speed: {weatherData.wind.speed} km/h</p>
    </div>
  </div>
        )}
      </div>

      <footer>
        <p>© 2024 Weather UB. All rights reserved.</p>
      </footer>
    </div>
  );
};


export default WeatherApp;
