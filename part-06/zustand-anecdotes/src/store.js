import { create } from "zustand";

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

const compareByVotes = (a1, a2) => a2.votes - a1.votes;

const useAnecdoteStore = create((set) => ({
  anecdotes: anecdotesAtStart.map(asObject),
  filter: "",
  actions: {
    vote: (id) =>
      set((state) => ({
        anecdotes: state.anecdotes
          .map((a) => (a.id === id ? { ...a, votes: a.votes + 1 } : a))
          .toSorted(compareByVotes),
      })),
    add: ({ content, votes }) =>
      set((state) => ({
        anecdotes: state.anecdotes
          .concat({ id: getId(), content, votes })
          .toSorted(compareByVotes),
      })),
    setFilter: (filter) => set((state) => ({ filter })),
  },
}));

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter);
  return anecdotes.filter((a) =>
    a.content.toLowerCase().includes(filter.toLowerCase()),
  );
};

export const useFilter = () => useAnecdoteStore((state) => state.filter);

export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
