import {
  useAnecdoteActions,
  useAnecdotes,
  useNotificationActions,
} from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote, remove } = useAnecdoteActions();
  const { showNotification } = useNotificationActions();

  const handleVote = (anecdote) => {
    vote(anecdote.id);
    showNotification(`You voted '${anecdote.content}'`);
  };

  const handleRemove = (anecdote) => {
    if (window.confirm(`Really remove '${anecdote.content}'?`)) {
      remove(anecdote.id);
      showNotification(`You removed '${anecdote.content}'`);
    }
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 ? (
              <button onClick={() => handleRemove(anecdote)}>remove</button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
