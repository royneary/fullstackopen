import { useEffect, useState } from "react";

import Countries from "./components/Countries";
import countriesService from "./services/countries";

const App = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countriesService
      .getAll()
      .then((receivedCountries) => setCountries(receivedCountries))

      .catch(() => {
        console.log("error fetching countries");
      });
  }, []);

  const changedQuery = (event) => {
    setQuery(event.target.value);
  };

  const clickedShowCountry = (country) => {
    setQuery(country);
  };

  const countriesToShow =
    query.length === 0
      ? []
      : countries.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <div>
      find countries <input value={query} onChange={changedQuery} />
      <Countries
        countries={countriesToShow}
        onShowCountry={clickedShowCountry}
      />
    </div>
  );
};

export default App;
