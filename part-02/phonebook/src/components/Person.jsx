const Person = ({ person, onDelete }) => (
  <div>
    {person.name} {person.number}
    <button onClick={() => onDelete(person)}>delete</button>
  </div>
);

export default Person;
