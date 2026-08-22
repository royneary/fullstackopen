import { useState } from "react";
import AnecdoteContext from "./AnecdoteContext";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Notification from "./components/Notification";
import { useAnecdotes } from "./hooks/useAnecdotes";

const App = () => {
  const { anecdotes, isError, isPending, voteAnecdote } = useAnecdotes();
  const [notification, setNotification] = useState(null);

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  if (isPending) {
    return <div>loading data...</div>;
  }

  const handleVote = (anecdote) => {
    voteAnecdote(anecdote);
  };

  return (
    <div>
      <h3>Anecdote app</h3>
      <AnecdoteContext.Provider value={{ notification, setNotification }}>
        <Notification />
        <AnecdoteForm />
        <AnecdoteList anecdotes={anecdotes} onVote={handleVote} />
      </AnecdoteContext.Provider>
    </div>
  );
};

export default App;
