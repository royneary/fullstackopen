import { create } from "zustand";
import anecdotesService from "./services/anecdotes";

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
        anecdotes: state.anecdotes.map((a) => (a.id === id ? updated : a)),
      }));
    },

    add: async ({ content, votes }) => {
      const newAnecdote = await anecdotesService.create({ content, votes });
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      }));
    },

    setFilter: (filter) => set(() => ({ filter })),
  },
}));

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    showNotification: (notification) => {
      set(() => ({ notification }));
      setTimeout(() => {
        set(() => ({ notification: null }));
      }, 5000);
    },
  },
}));

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter);
  return anecdotes
    .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((a1, a2) => a2.votes - a1.votes);
};

export const useFilter = () => useAnecdoteStore((state) => state.filter);
export const useNotification = () =>
  useNotificationStore((state) => state.notification);

export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
