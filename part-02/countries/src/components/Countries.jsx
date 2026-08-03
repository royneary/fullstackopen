import Country from "./Country";

const Countries = ({ countries, onShowCountry }) => {
  if (countries.length === 0) {
    return null;
  }
  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }
  return (
    <ul>
      {countries.map((c) => (
        <li key={c.name}>
          {c.name} <button onClick={() => onShowCountry(c.name)}>Show</button>
        </li>
      ))}
    </ul>
  );
};

export default Countries;
