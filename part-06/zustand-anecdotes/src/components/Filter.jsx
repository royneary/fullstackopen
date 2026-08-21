import { useAnecdoteActions, useFilter } from "../store";

const Filter = () => {
  const filter = useFilter();
  const { setFilter } = useAnecdoteActions();

  return (
    <label>
      filter
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </label>
  );
};

export default Filter;
