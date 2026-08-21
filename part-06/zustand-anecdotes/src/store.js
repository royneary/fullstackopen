import { create } from "zustand";
import anecdotesService from "./services/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);

const compareByVotes = (a1, a2) => a2.votes - a1.votes;

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    initialize: async () => {
      const anecdotes = await anecdotesService.getAll();
      set(() => ({ anecdotes }));
    },

    vote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id);
      const updated = await anecdotesService.update(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      });
      set((state) => ({
        anecdotes: state.anecdotes
          .map((a) => (a.id === id ? updated : a))
          .toSorted(compareByVotes),
      }));
    },

    add: async ({ content, votes }) => {
      const newAnecdote = await anecdotesService.create({ content, votes });
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote).toSorted(compareByVotes),
      }));
    },

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
