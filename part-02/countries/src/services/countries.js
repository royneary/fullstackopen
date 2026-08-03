import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getAll = () =>
  axios.get(`${baseUrl}/all`).then((response) =>
    response.data.map((c) => ({
      name: c.name.common,
      capital: c.capital ? c.capital[0] : "",
      area: c.area,
      languages: c.languages ? Object.values(c.languages) : [],
      flag: c.flags.svg,
      latlng: c.latlng,
    })),
  );

export default { getAll };
