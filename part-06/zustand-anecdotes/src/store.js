import { create } from "zustand";
import anecdotesService from "./services/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

const compareByVotes = (a1, a2) => a2.votes - a1.votes;

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: "",
  actions: {
    initialize: async () => {
      const anecdotes = await anecdotesService.getAll();
      set(() => ({ anecdotes }));
    },

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

    setFilter: (filter) => set(() => ({ filter })),
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
