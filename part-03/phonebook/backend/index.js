import express from "express";
import morgan from "morgan";

const app = express();

morgan.token("body", (request, _response) => JSON.stringify(request.body));

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (_request, response) => {
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

app.get("/api/persons", (_reqeust, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find((p) => p.id === id);
  if (!person) {
    return response.status(404).end();
  }
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const generateId = () =>
  String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "name is missing" });
  }
  if (!body.number) {
    return response.status(400).json({ error: "number is missing" });
  }
  if (persons.find((p) => p.name === body.name)) {
    return response.status(409).json({ error: "name must be unique" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
