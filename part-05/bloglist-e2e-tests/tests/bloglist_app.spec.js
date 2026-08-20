const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

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
    await request.post("/api/users", {
      data: {
        name: "Superuser",
        username: "root",
        password: "verysecurepassword",
      },
    });
  });

  test("Login form is shown", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: "Log in to application" }),
    ).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "christian", "verysecurepassword");
      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "christian", "wrongpassword");
      await expect(page.getByText("wrong username or password")).toBeVisible();
      await expect(page.getByRole("link", { name: "login" })).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "christian", "verysecurepassword");
      await page.getByRole("button", { name: "logout" }).waitFor();
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "Learning Web Development",
        "Christian Ulrich",
        "https://christian.nerdsoli.de/webdev",
      );

      await expect(
        page.getByText(
          "a new blog Learning Web Development by Christian Ulrich added",
        ),
      ).toBeVisible();

      await expect(
        page.getByRole("link", {
          name: "Learning Web Development by Christian Ulrich",
        }),
      ).toBeVisible();
    });

    describe("When a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "Learning Web Development",
          "Christian Ulrich",
          "https://christian.nerdsoli.de/webdev",
        );
      });

      test("the blog can be liked", async ({ page }) => {
        await page.goto("/");
        await page
          .getByRole("link", {
            name: "Learning Web Development by Christian Ulrich",
          })
          .click();

        await expect(page.getByText("likes 0")).toBeVisible();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("the blog can be deleted", async ({ page }) => {
        await page.goto("/");
        await page
          .getByRole("link", {
            name: "Learning Web Development by Christian Ulrich",
          })
          .click();

        page.on("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();

        await expect(
          page.getByText(
            `blog Learning Web Development by Christian Ulrich deleted`,
          ),
        ).toBeVisible();

        await expect(
          page.getByRole("link", {
            name: "Learning Web Development by Christian Ulrich",
          }),
        ).not.toBeVisible();
      });
    });
  });
});
