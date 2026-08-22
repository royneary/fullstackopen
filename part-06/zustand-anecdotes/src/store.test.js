import { describe, test, expect, beforeEach, vi } from "vitest";
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from "./store";
import anecdotesService from "./services/anecdotes";
import { renderHook, act } from "@testing-library/react";

vi.mock("./services/anecdotes.js", () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

beforeEach(() => {
  useAnecdoteStore.setState([]);
  vi.clearAllMocks();
});

test("initialize loads anecdotes from service", async () => {
  const mockAnecdotes = [
    {
      content: "If it hurts, do it more often",
      id: "47145",
      votes: 0,
    },
    {
      content: "Adding manpower to a late software project makes it later!",
      id: "21149",
      votes: 0,
    },
    {
      content:
        "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
      id: "69581",
      votes: 0,
    },
  ];
  anecdotesService.getAll.mockResolvedValue(mockAnecdotes);

  const { result } = renderHook(() => useAnecdoteActions());

  await act(async () => {
    await result.current.initialize();
  });

  const { result: anecdotesResult } = renderHook(() => useAnecdotes());
  expect(anecdotesResult.current).toEqual(mockAnecdotes);
});

test("anecdotes are returned sorted by votes", async () => {
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

  useAnecdoteStore.setState({ anecdotes });

  const { result } = renderHook(() => useAnecdotes());

  expect(result.current.map((a) => a.votes)).toEqual([15, 4, 3]);
});
