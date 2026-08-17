import { render, screen } from "@testing-library/react";
import CreateBlogForm from "./CreateBlogForm";
import userEvent from "@testing-library/user-event";

test("onCreate is called with the correct data", async () => {
  const handleCreate = vi.fn();

  render(<CreateBlogForm onCreate={handleCreate} />);

  const user = userEvent.setup();
  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");
  const createButton = screen.getByText("create");

  await user.type(titleInput, "TypeScript is not that bad");
  await user.type(authorInput, "Christian Ulrich");
  await user.type(urlInput, "https://christian.nerdsoli.de/typescript");
  await user.click(createButton);

  expect(handleCreate.mock.calls[0][0].title).toBe(
    "TypeScript is not that bad",
  );
  expect(handleCreate.mock.calls[0][0].author).toBe("Christian Ulrich");
  expect(handleCreate.mock.calls[0][0].url).toBe(
    "https://christian.nerdsoli.de/typescript",
  );
});
