import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import Weather from "./components/Weather";
import Forecast from "./components/Forecast";
import axios from "axios";

const App = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [location, setLocation] = useState({ lat: null, lon: null });

  // Formatting current date
  useEffect(() => {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    setCurrentDate(formattedDate);
  }, []);

  //Fetching location from geolocation API
  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Error getting location!");
      }
      function success(position) {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      }
      function error() {
        console.log("Unable to retrieve your location");
      }
    };
    getLocation();
  }, []);

  /* For search funtionality. Changes location so that the Weather and Forecast components change instantly
     since both of them depend on location */
  const handleSearch = async (query) => {
    try {
      const res = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: query,
            limit: 1,
            appid: `${process.env.REACT_APP_API_KEY}`,
          },
        }
      );
      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setLocation({ lat, lon });
      } else {
        alert("Location not found! Try again.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // self explanantory
  const convertCelsiusToFahrenheit = (temp) => {
    return Math.round((temp * 9) / 5 + 32);
  };

  return (
    <div className="bg-image bg-cover bg-center bg-no-repeat min-h-screen flex flex-col gap-10 items-center">
      <SearchBar onSearch={handleSearch} />
      <p className="font-bold">{currentDate}</p>
      <Weather
        location={location}
        convertToFahrenheit={convertCelsiusToFahrenheit}
      />
      <Forecast
        location={location}
        convertToFahrenheit={convertCelsiusToFahrenheit}
      />
    </div>
  );
};

export default App;
