const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const loginRouter = require("./controllers/login");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");

const app = express();

mongoose.connect(config.MONGODB_URI, { family: 4 });

app.use(middleware.tokenExtractor);

app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);

app.use("/api/blogs", blogsRouter);

app.use("/api/users", usersRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);

app.use(middleware.errorHandler);

module.exports = app;
