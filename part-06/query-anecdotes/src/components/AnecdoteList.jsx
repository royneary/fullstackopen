import useNotify from "../hooks/useNotify";

const AnecdoteList = ({ anecdotes, onVote }) => {
  const { setNotification } = useNotify();

  const handleVote = (anecdote) => {
    onVote(anecdote);
    setNotification(`anecdote '${anecdote.content}' voted`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
