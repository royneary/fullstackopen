import axios from "axios";

const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const api_key = import.meta.env.VITE_API_KEY;

const iconUrl = (id) =>
  `https://openweathermap.org/payload/api/media/file/${id}.png`;

const currentWeather = (latitude, longitude) => {
  return axios
    .get(baseUrl, {
      params: {
        lat: latitude,
        lon: longitude,
        units: "metric",
        appid: api_key,
      },
    })
    .then((response) => ({
      temperature: response.data.main.temp,
      wind: response.data.wind.speed,
      description: response.data.weather[0].description,
      icon: iconUrl(response.data.weather[0].icon),
    }));
};

export default { currentWeather };
