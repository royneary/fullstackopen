import useNotify from "../hooks/useNotify";

const AnecdoteList = ({ anecdotes, onVote }) => {
  const { notify } = useNotify();

  const handleVote = (anecdote) => {
    onVote(anecdote);
    notify(`anecdote '${anecdote.content}' voted`);
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
