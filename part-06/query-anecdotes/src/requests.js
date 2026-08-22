const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }
  return await response.json();
};

export const createAnecdote = async ({ content, votes }) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, votes }),
  };
  const response = await fetch(baseUrl, options);
  if (!response.ok) {
    throw new Error("Failed to create anecdote");
  }
  return await response.json();
};

export const updateAnecdote = async ({ id, content, votes }) => {
  console.log("updateAnecdote, content:", content, "votes:", votes);
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, votes }),
  };
  const response = await fetch(`${baseUrl}/${id}`, options);
  if (!response.ok) {
    console.log("failed to update anecdote");
    throw new Error("Failed to update anecdote");
  }
  return await response.json();
};
