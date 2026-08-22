import { useAnecdotes } from "../hooks/useAnecdotes";
import useNotify from "../hooks/useNotify";

const AnecdoteForm = () => {
  const { notify } = useNotify();
  const { createAnecdote } = useAnecdotes();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    createAnecdote(content);
    event.target.reset();
    notify(`anecdote '${content}' created`);
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
