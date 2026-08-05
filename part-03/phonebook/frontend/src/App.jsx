import { useEffect, useState } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const personsToShow = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const showInfo = (message) => {
    setNotification({ className: "info", message });
    setTimeout(() => setNotification(null), 5000);
  };

  const showError = (message) => {
    setNotification({ className: "error", message });
    setTimeout(() => setNotification(null), 5000);
  };

  const changedName = (event) => setNewName(event.target.value);

  const changedNumber = (event) => setNewNumber(event.target.value);

  const changedFilter = (event) => setFilter(event.target.value);

  const clickedAdd = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((p) => p.name === newName);
    if (existingPerson) {
      // person already exists
      const question = `${newName} is already added to phonebook, replace the old number with a new one?`;
      if (window.confirm(question)) {
        personService
          .update({ ...existingPerson, number: newNumber })
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id === returnedPerson.id ? returnedPerson : p,
              ),
            );
            setNewName("");
            setNewNumber("");
            showInfo(`Updated ${returnedPerson.name}`);
          });
      }
      return;
    }

    // person does not exist yet
    const newPerson = { name: newName, number: newNumber };
    personService.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
      showInfo(`Added ${returnedPerson.name}`);
    });
  };

  const clickedDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
        })
        .catch(() => {
          showError(
            `Information for ${person.name} has already been removed from the server`,
          );
          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={changedFilter} />
      <h2>add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={changedName}
        onNumberChange={changedNumber}
        onSubmit={clickedAdd}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={clickedDelete} />
    </div>
  );
};

export default App;
