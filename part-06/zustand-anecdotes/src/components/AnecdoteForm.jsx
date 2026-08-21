import { useAnecdoteActions, useNotificationActions } from "../store";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();
  const { showNotification } = useNotificationActions();

  const handleCreate = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    add({ content, votes: 0 });
    showNotification(`You created '${content}'`);
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
