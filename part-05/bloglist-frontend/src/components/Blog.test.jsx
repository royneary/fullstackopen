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

test("by default only title and author are shown, not URL or likes", () => {
  render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} />);

  const titleElement = screen.getByText(blog.title, { exact: false });
  const authorElement = screen.getByText(blog.author, { exact: false });

  expect(titleElement).toBeVisible();
  expect(authorElement).toBeVisible();

  const urlElement = screen.queryByText(blog.url, { exact: false });
  const likesElement = screen.queryByText(`likes ${blog.likes}`, {
    exact: false,
  });

  expect(urlElement).toBeNull();
  expect(likesElement).toBeNull();
});

test("URL and likes are shown after 'view' has been clicked", async () => {
  render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} />);

  const viewButton = screen.getByText("view");
  const user = userEvent.setup();
  await user.click(viewButton);

  const urlElement = screen.getByText(blog.url, { exact: false });
  const likesElement = screen.getByText(`likes ${blog.likes}`, {
    exact: false,
  });

  expect(urlElement).toBeVisible();
  expect(likesElement).toBeVisible();
});

test("when clicking the like button, twice, onLike is called twice", async () => {
  const handleLike = vi.fn();

  render(<Blog blog={blog} onLike={handleLike} onDelete={() => {}} />);

  const user = userEvent.setup();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(handleLike.mock.calls).toHaveLength(2);
});
