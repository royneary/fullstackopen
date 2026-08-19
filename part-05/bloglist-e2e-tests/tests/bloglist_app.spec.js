const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Christian Ulrich",
        username: "christian",
        password: "verysecurepassword",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Log in to application" }),
    ).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "christian", "verysecurepassword");
      await expect(page.getByText("Christian Ulrich logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "christian", "wrongpassword");
      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "christian", "verysecurepassword");
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title:").fill("Learning Web Development");
      await page.getByLabel("author:").fill("Christian Ulrich");
      await page
        .getByLabel("url:")
        .fill("https://christian.nerdsoli.de/webdev");
      await page.getByRole("button", { name: "create" }).click();

      await expect(
        page.getByText("Learning Web Development Christian Ulrich"),
      ).toBeVisible();
    });
  });
});
