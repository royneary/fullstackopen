const loginWith = async (page, username, password) => {
  await page.goto("/login");
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.goto("/create");
  await page.getByLabel("title:").fill(title);
  await page.getByLabel("author:").fill(author);
  await page.getByLabel("url:").fill(url);
  await page.getByRole("button", { name: "create" }).click();
};

module.exports = { loginWith, createBlog };
