import Weather from "./Weather";

const Country = ({
  country: { name, capital, area, languages, flag, latlng },
}) => {
  const [latitude, longitude] = latlng;

  return (
    <div>
      <h1>{name}</h1>
      <div>Capital {capital}</div>
      <div>Area {area}</div>

      <h2>Languages</h2>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={flag} alt={`flag of ${name}`} width="250" />

      <h2>Weather in {capital}</h2>
      <Weather latitude={latitude} longitude={longitude} />
    </div>
  );
};

export default Country;
