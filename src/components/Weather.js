import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import { BsSunriseFill, BsSunsetFill } from "react-icons/bs";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa6";

const Weather = ({ location, convertToFahrenheit }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Depends on location. Fetches weather data via OpenWeather API
  useEffect(() => {
    if (location.lat !== null && location.lon !== null) {
      const fetchWeatherData = async () => {
        try {
          const res = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
              params: {
                lat: location.lat,
                lon: location.lon,
                appid: `${process.env.REACT_APP_API_KEY}`,
                units: "metric",
              },
            }
          );
          setWeatherData(res.data);
        } catch (err) {
          setError(err);
        }
      };
      fetchWeatherData();
    }
  }, [location]);

  if (error) return <p>Error fetching data: {error.message}</p>;

  if (!weatherData) return <Loader />;

  // Formatting UNIX timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getHours();
    const minutes = `0${date.getMinutes()}`.slice(-2); // Ensures two digits
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const iconUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  return (
    <div className="flex flex-col items-center gap-3 bg-white bg-opacity-10 rounded-2xl shadow-5xl backdrop-filter backdrop-blur-sm p-4 md:p-6 w-full max-w-sm md:max-w-md">
      {weatherData ? (
        <>
          <h1 className="text-lg md:text-xl font-bold text-center">
            {weatherData.name}, {weatherData.sys.country}
          </h1>
          <h2 className="text-md md:text-lg text-center">
            {weatherData.weather[0].description}
          </h2>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <img
              src={iconUrl}
              alt="Weather icon"
              className="w-20 h-20 md:w-32 md:h-32"
            ></img>
            <h1 className="font-bold text-4xl md:text-5xl">
              {Math.round(weatherData.main.temp)}°C/
              {convertToFahrenheit(weatherData.main.temp)}°F
            </h1>
          </div>
          <div className="flex flex-col items-center gap-2 text-sm md:text-base">
            <p>
              Feels like {Math.round(weatherData.main.feels_like)}°C/
              {convertToFahrenheit(weatherData.main.feels_like)}°F
            </p>
            <p>
              Min: {Math.round(weatherData.main.temp_min)}°C/
              {convertToFahrenheit(weatherData.main.temp_min)}°F
            </p>
            <p>
              Max: {Math.round(weatherData.main.temp_max)}°C/
              {convertToFahrenheit(weatherData.main.temp_max)}°F
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-around items-center gap-2 text-sm md:text-base mt-4">
            <div className="flex items-center gap-2">
              <BsSunriseFill />
              <p>Sunrise: {formatTime(weatherData.sys.sunrise)}</p>
            </div>
            <div className="flex items-center gap-2">
              <BsSunsetFill />
              <p>Sunset: {formatTime(weatherData.sys.sunset)}</p>
            </div>
            <div className="flex items-center gap-2">
              <WiHumidity />
              <p>Humidity: {weatherData.main.humidity}%</p>
            </div>
            <div className="flex items-center gap-2">
              <FaWind />
              <p>Wind Speed: {weatherData.wind.speed}km/h</p>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Weather;
