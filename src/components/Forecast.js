import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";

const Forecast = ({ location, convertToFahrenheit }) => {
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);

  // Depends on location. Fetches forecast data via OpenWeather API
  useEffect(() => {
    if (location.lat !== null && location.lon !== null) {
      const fetchForecastData = async () => {
        try {
          const res = await axios.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            {
              params: {
                lat: location.lat,
                lon: location.lon,
                appid: `${process.env.REACT_APP_API_KEY}`,
                units: "metric",
              },
            }
          );
          const dailyForecast = res.data.list
            .filter((reading) => reading.dt_txt.includes("12:00:00"))
            .slice(0, 5);
          setForecastData(dailyForecast);
        } catch (err) {
          setError(err);
        }
      };
      fetchForecastData();
    }
  }, [location]);

  if (error) return <p>Error fetching data: {error.message}</p>;

  if (!forecastData) return <Loader />;

  // So that days[getDay()] corresponds to abbreviation
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <h1 className="text-xl font-bold">5-Day Daily Forecast</h1>
      <div className="flex flex-col md:flex-row gap-5 md:gap-10 bg-white bg-opacity-10 rounded-2xl shadow-5xl backdrop-filter backdrop-blur-sm mb-4">
        {forecastData ? (
          forecastData.map((day, index) => {
            const dayName = days[new Date(day.dt_txt).getDay()];
            const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
            return (
              <div
                key={index}
                className="flex flex-row md:flex-col items-center justify-center p-2 md:p-4 space-y-2 md:space-y-4"
              >
                <p className="text-sm md:text-base mt-2 md:mt-0">{dayName}</p>
                <img
                  src={iconUrl}
                  alt="Forecast icon"
                  className="w-8 h-8 md:w-12 md:h-12"
                ></img>
                <p className="text-sm md:text-base">
                  {Math.round(day.main.temp)}°C/
                  {convertToFahrenheit(day.main.temp)}°F
                </p>
              </div>
            );
          })
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default Forecast;
