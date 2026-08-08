require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

morgan.token("body", (request, _response) => JSON.stringify(request.body));

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(express.static("dist"));

app.get("/info", (_request, response) => {
  Person.find({}).then((persons) => {
    const now = new Date();
    const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Phonebook</title>
  </head>
  <body>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${now}</p>
  </body>
</html>`;

    response.send(html);
  });
});

app.get("/api/persons", (_reqeust, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      console.log("person", person);
      if (!person) {
        return response.status(404).end();
      }
      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((_result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "name is missing" });
  }
  if (!body.number) {
    return response.status(400).json({ error: "number is missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((returnedPerson) => {
    response.json(returnedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;
      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

const errorHandler = (error, _request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
