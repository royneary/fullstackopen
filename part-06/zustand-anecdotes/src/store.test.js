import { describe, test, expect, beforeEach, vi } from "vitest";
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from "./store";
import anecdotesService from "./services/anecdotes";
import { renderHook, act } from "@testing-library/react";

const anecdotes = [
  {
    content: "If it hurts, do it more often",
    id: "47145",
    votes: 3,
  },
  {
    content: "Adding manpower to a late software project makes it later!",
    id: "21149",
    votes: 15,
  },
  {
    content:
      "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    id: "69581",
    votes: 4,
  },
];

vi.mock("./services/anecdotes.js", () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: "" });
  vi.clearAllMocks();
});

test("initialize loads anecdotes from service", async () => {
  anecdotesService.getAll.mockResolvedValue(anecdotes);

  const { result } = renderHook(() => useAnecdoteActions());

  await act(async () => {
    await result.current.initialize();
  });

  const { result: anecdotesResult } = renderHook(() => useAnecdotes());

  anecdotes.forEach((anecdote) => {
    expect(anecdotesResult.current).toContainEqual(anecdote);
  });
});

test("anecdotes are returned sorted by votes", async () => {
  useAnecdoteStore.setState({ anecdotes });

  const { result } = renderHook(() => useAnecdotes());

  expect(result.current.map((a) => a.votes)).toEqual([15, 4, 3]);
});

test("anecdotes are filtered correctly", () => {
  useAnecdoteStore.setState({ anecdotes });

  const { result: actionsResult } = renderHook(() => useAnecdoteActions());

  act(() => {
    actionsResult.current.setFilter("Software");
  });

  const { result } = renderHook(() => useAnecdotes());

  expect(result.current).toEqual([
    {
      content: "Adding manpower to a late software project makes it later!",
      id: "21149",
      votes: 15,
    },
  ]);
});

test("voting increases the number of votes", async () => {
  useAnecdoteStore.setState({ anecdotes });

  const updated = { ...anecdotes[0], votes: anecdotes[0].votes + 1 };
  anecdotesService.update.mockResolvedValue(updated);
  anecdotesService.getAll.mockResolvedValue([updated, ...anecdotes.slice(1)]);

  const { result: actionsResult } = renderHook(() => useAnecdoteActions());

  await act(async () => {
    await actionsResult.current.vote(updated.id);
  });

  const { result } = renderHook(() => useAnecdotes());

  expect(result.current).toContainEqual(updated);
});
