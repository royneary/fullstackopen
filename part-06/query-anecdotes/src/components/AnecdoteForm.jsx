import { useAnecdotes } from "../hooks/useAnecdotes";
import useNotify from "../hooks/useNotify";

const AnecdoteForm = () => {
  const { setNotification } = useNotify();
  const { createAnecdote } = useAnecdotes();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    createAnecdote(content);
    event.target.reset();
    setNotification(`anecdote '${content}' created`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
