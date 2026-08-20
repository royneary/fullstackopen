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

        await expect(
          blogDiv.getByRole("button", { name: "remove" }),
        ).toBeVisible();
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

        await expect(
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
        await page
          .getByText("Learning Web Development by Christian Ulrich deleted")
          .waitFor();
        await expect(
          page.getByText("Learning Web Development Christian Ulrich"),
        ).not.toBeVisible();
      });
    });

    describe("When multiple blogs exist", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "TestBlog1",
          "Christian Ulrich",
          "https://christian.nerdsoli.de/1",
        );
        await createBlog(
          page,
          "TestBlog2",
          "Christian Ulrich",
          "https://christian.nerdsoli.de/2",
        );
        await createBlog(
          page,
          "TestBlog3",
          "Christian Ulrich",
          "https://christian.nerdsoli.de/3",
        );
      });

      test("the blogs are sorted by likes", async ({ page }) => {
        const blog1 = page.getByText(/^TestBlog1/);
        const blog2 = page.getByText(/^TestBlog2/);
        const blog3 = page.getByText(/^TestBlog3/);

        await blog1.getByRole("button", { name: "view" }).click();
        await blog2.getByRole("button", { name: "view" }).click();
        await blog3.getByRole("button", { name: "view" }).click();

        // TestBlog1 has 1 like
        await blog1.getByRole("button", { name: "like" }).click();

        // TestBlog2 has 3 likes
        await blog2.getByRole("button", { name: "like" }).click();
        await blog2.getByRole("button", { name: "like" }).click();
        await blog2.getByRole("button", { name: "like" }).click();

        // TestBlog3 has 2 likes
        await blog3.getByRole("button", { name: "like" }).click();
        await blog3.getByRole("button", { name: "like" }).click();

        const blogs = await page.getByText(/^TestBlog/).all();
        await expect(blogs[0].getByText(/^TestBlog2/)).toBeVisible();
        await expect(blogs[1].getByText(/^TestBlog3/)).toBeVisible();
        await expect(blogs[2].getByText(/^TestBlog1/)).toBeVisible();
      });
    });
  });
});
