const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const usage = () => {
  console.log("usage: mongo.js PASSWORD [NAME NUMBER]");
};

const connect = (password) => {
  const encodedPassword = encodeURIComponent(password);
  const url = `mongodb://phonebook:${encodedPassword}@localhost/phonebook`;
  mongoose.set("strictQuery", false);
  mongoose.connect(url, { family: 4 });
};

const showPersons = (password) => {
  connect(password);
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
};

const savePerson = (password, name, number) => {
  connect(password);
  const person = new Person({ name, number });
  person.save().then(() => {
    console.log("person saved!");
    mongoose.connection.close();
  });
};

if (process.argv.length === 3) {
  const password = process.argv[2];
  showPersons(password);
} else if (process.argv.length === 5) {
  const password = process.argv[2];
  const name = process.argv[3];
  const number = process.argv[4];
  savePerson(password, name, number);
} else {
  usage();
  process.exit(1);
}
