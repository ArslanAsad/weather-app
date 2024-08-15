import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchBarRef = useRef(null); // Creates a reference to SearchBar component

  // Fetching autocomplete suggestions as input changes
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() !== "") {
      try {
        const res = await axios.get(
          "https://api.openweathermap.org/geo/1.0/direct",
          {
            params: {
              q: value,
              limit: 5,
              appid: `${process.env.REACT_APP_API_KEY}`,
            },
          }
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error("Error fetching autocomplete suggestions:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle click on suggestion, fetch weather, forecast data
  const handleSelectSuggestion = (suggestion) => {
    const locationName = `${suggestion.name}, ${suggestion.country}`;
    setQuery(locationName);
    setSuggestions([]);
    onSearch(locationName);
  };

  // Fetch weather, forecast data based on input value
  const handleSearch = () => {
    if (query.trim() !== "") {
      onSearch(query);
    }
  };

  // handle pressing enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Suggestions to disappear when user clicks on anything besides SearchBar
  const handleClickOutside = (e) => {
    if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
      setSuggestions([]);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchBarRef}
      className="relative flex flex-col items-center justify-center w-full max-w-md"
    >
      <div className="flex flex-row gap-4 items-center justify-center mt-6">
        <input
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="w-full h-8 bg-white bg-opacity-85 border border-black rounded-sm shadow-2xl pl-2"
        ></input>
        <button onClick={handleSearch}>
          <FaSearch size={25} className="cursor-pointer" />
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
