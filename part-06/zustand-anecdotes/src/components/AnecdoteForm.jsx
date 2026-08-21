import { useAnecdoteActions } from "../store";
import anecdotesService from "../services/anecdotes";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();

  const handleCreate = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    const newAnecdote = await anecdotesService.create({ content, votes: 0 });
    add(newAnecdote);
    e.target.reset();
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
