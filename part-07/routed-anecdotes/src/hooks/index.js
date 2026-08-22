import { useEffect, useState } from "react";
import anecdotesService from "../services/anecdotes";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = (event) => {
    setValue("");
  };

  return {
    type,
    value,
    onChange,
    reset,
  };
};

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdotesService
      .getAll()
      .then((receivedAnecdotes) => setAnecdotes(receivedAnecdotes));
  }, []);

  const addAnecdote = ({ content, author, info }) => {
    anecdotesService
      .createNew({ content, author, info, votes: 0 })
      .then((receivedAnecdote) =>
        setAnecdotes(anecdotes.concat(receivedAnecdote)),
      );
  };

  return {
    anecdotes,
    addAnecdote,
  };
};
