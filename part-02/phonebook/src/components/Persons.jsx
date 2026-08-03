import Person from "./Person";

const Persons = ({ persons, onDelete }) =>
  persons.map((p) => <Person key={p.id} person={p} onDelete={onDelete} />);

export default Persons;
