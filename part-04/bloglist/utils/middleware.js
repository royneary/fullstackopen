const logger = require("./logger");

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (
    error.name === "MongoServerError" &&
    error.message.startsWith("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "field `username` must be unique" });
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

module.exports = { errorHandler, unknownEndpoint };
