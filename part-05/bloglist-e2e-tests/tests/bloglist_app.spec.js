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
      await createBlog(
        page,
        "Learning Web Development",
        "Christian Ulrich",
        "https://christian.nerdsoli.de/webdev",
      );

      await expect(
        page.getByText("Learning Web Development Christian Ulrich"),
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
        const blogDiv = page.getByText(
          "Learning Web Development Christian Ulrich",
        );
        await blogDiv.getByRole("button", { name: "view" }).click();

        await expect(blogDiv.getByText("likes 0")).toBeVisible();
        await blogDiv.getByRole("button", { name: "like" }).click();
        await expect(blogDiv.getByText("likes 1")).toBeVisible();
      });

      test("the delete button is visible", async ({ page }) => {
        const blogDiv = page.getByText(
          "Learning Web Development Christian Ulrich",
        );
        await blogDiv.getByRole("button", { name: "view" }).click();

        expect(blogDiv.getByRole("button", { name: "remove" })).toBeVisible();
      });

      test("the delete button is not visible when logged in as another user", async ({
        page,
      }) => {
        await page.getByRole("button", { name: "logout" }).click();
        await loginWith(page, "root", "verysecurepassword");

        const blogDiv = page.getByText(
          "Learning Web Development Christian Ulrich",
        );
        await blogDiv.getByRole("button", { name: "view" }).click();

        expect(
          blogDiv.getByRole("button", { name: "remove" }),
        ).not.toBeVisible();
      });

      test("the blog can be deleted", async ({ page }) => {
        const blogDiv = page.getByText(
          "Learning Web Development Christian Ulrich",
        );
        await blogDiv.getByRole("button", { name: "view" }).click();

        page.on("dialog", (dialog) => dialog.accept());
        await blogDiv.getByRole("button", { name: "remove" }).click();
        page
          .getByText("Learning Web Development by Christian Ulrich deleted")
          .waitFor();
        expect(
          page.getByText("Learning Web Development Christian Ulrich"),
        ).not.toBeVisible();
      });
    });
  });
});
