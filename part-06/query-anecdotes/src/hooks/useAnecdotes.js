import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAnecdote, getAnecdotes, updateAnecdote } from "../requests";

export const useAnecdotes = () => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
  });

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ["notes"] });
    },
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ["notes"] });
    },
  });

  return {
    anecdotes: result.data,
    isError: result.isError,
    isPending: result.isPending,
    createAnecdote: (content) =>
      newAnecdoteMutation.mutate({ content, votes: 0 }),
    voteAnecdote: (anecdote) => {
      const updated = { ...anecdote, votes: anecdote.votes + 1 };
      updateAnecdoteMutation.mutate(updated);
    },
  };
};
