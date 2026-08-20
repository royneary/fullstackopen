import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

const blog = {
  title: "TypeScript is not that bad",
  author: "Christian",
  url: "https://christian.nerdsoli.de/typescript",
  likes: 23,
  user: {
    username: "root",
    name: "Superuser",
  },
};

const user1 = {
  name: "Superuser",
  username: "root",
};

const user2 = {
  name: "Christian Ulrich",
  username: "christian",
};

test("to unauthenticated users, blog info and likes are displayed, buttons are not displayed", () => {
  render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} />);

  expect(screen.getByText(`${blog.title}`)).toBeVisible();
  expect(screen.getByText(`by ${blog.author}`)).toBeVisible();
  expect(screen.getByText(blog.url)).toBeVisible();
  expect(screen.getByText(`${blog.likes} likes`)).toBeVisible();
  expect(screen.getByText(`Added by ${blog.author}`)).toBeVisible();

  expect(screen.queryByRole("button", { name: "like" }) === null);
  expect(screen.queryByRole("button", { name: "remove" }) === null);
});

test("to authenticated users who are not the blog's creator, only the like button is displayed", () => {
  render(
    <Blog blog={blog} user={user2} onLike={() => {}} onDelete={() => {}} />,
  );

  expect(screen.getByRole("button", { name: "like" })).toBeVisible();
  expect(screen.queryByRole("button", { name: "remove" }) === null);
});

test("to the blog's creator, the delete button is displayed", () => {
  render(
    <Blog blog={blog} user={user1} onLike={() => {}} onDelete={() => {}} />,
  );

  expect(screen.getByRole("button", { name: "like" })).toBeVisible();
  expect(screen.getByRole("button", { name: "remove" })).toBeVisible();
});

test("when clicking the like button, twice, onLike is called twice", async () => {
  const handleLike = vi.fn();

  render(
    <Blog blog={blog} user={user1} onLike={handleLike} onDelete={() => {}} />,
  );

  const user = userEvent.setup();

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(handleLike.mock.calls).toHaveLength(2);
});
