import { useEffect, useState } from "react";

import weatherService from "../services/weather";

const Weather = ({ latitude, longitude }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService
      .currentWeather(latitude, longitude)
      .then((returnedWeather) => {
        setWeather(returnedWeather);
      })
      .catch((error) => console.log("failed to query weather", error));
  }, []);

  if (weather === null) {
    return null;
  }

  return (
    <div>
      <div>Temperature {weather.temperature} Celsius</div>
      <img src={weather.icon} alt={weather.description} />
      <div>Wind {weather.wind} m/s</div>
    </div>
  );
};

export default Weather;
