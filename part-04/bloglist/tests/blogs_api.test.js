const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

describe("With some initial blogs in the database", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("all blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /^application\/json/);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("blogs have an 'id' identifier, not '_id'", async () => {
    const response = await api.get("/api/blogs");

    response.body.forEach((blog) => {
      assert.notStrictEqual(blog.id, undefined);
      assert.strictEqual(blog._id, undefined);
    });
  });

  describe("addition of a new blog", () => {
    test("works if all fields are valid", async () => {
      const blogsAtStart = await helper.blogsInDb();

      const newBlog = {
        title: "Learning full-stack web development",
        author: "Christian Ulrich",
        url: "https://christian.nerdsoli.de/learning-full-stack-web-dev",
        likes: 0,
      };
      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /^application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      const newBlogInDb = blogsAtEnd.find(
        (blog) => blog.id === response.body.id,
      );

      assert.notStrictEqual(newBlogInDb, undefined);
      assert.strictEqual(newBlogInDb.title, newBlog.title);
      assert.strictEqual(newBlogInDb.author, newBlog.author);
      assert.strictEqual(newBlogInDb.url, newBlog.url);
      assert.strictEqual(newBlogInDb.likes, newBlog.likes);
    });

    test("works without likes, assigning default value 0", async () => {
      const newBlog = {
        title: "Learning full-stack web development",
        author: "Christian Ulrich",
        url: "https://christian.nerdsoli.de/learning-full-stack-web-dev",
      };

      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /^application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test("returns status code 400 without title", async () => {
      const newBlog = {
        author: "Christian Ulrich",
        url: "https://christian.nerdsoli.de/learning-full-stack-web-dev",
        likes: 0,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("returns status code 400 without url", async () => {
      const newBlog = {
        title: "Learning full-stack web development",
        author: "Christian Ulrich",
        likes: 0,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    describe("deletion of a blog", () => {
      test("succeeds with status code 204 if id is valid", async () => {
        const blogsAtStart = await helper.blogsInDb();

        const blogToDelete = blogsAtStart[0];

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

        const ids = blogsAtEnd.map((blog) => blog.id);
        assert.strict(!ids.includes(blogToDelete.id));
      });

      test("has no effect if blog does not exist (idempotency)", async () => {
        const blogsAtStart = await helper.blogsInDb();

        const nonExistingId = await helper.nonExistingId();

        await api.delete(`/api/blogs/${nonExistingId}`).expect(204);

        const blogsAtEnd = await helper.blogsInDb();

        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);
      });

      test("fails with status code 400 if id is invalid", async () => {
        const blogsAtStart = await helper.blogsInDb();

        const invalidId = "230948209348";

        await api.delete(`/api/blogs/${invalidId}`).expect(400);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);
      });
    });

    describe("updating a blog", () => {
      test("succeeds if all fields are given", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];

        const newBlog = {
          title: "Learning Full-Stack Web Development",
          author: "Christian Ulrich",
          url: "https://christian.nerdsoli.de/learning-full-stack-web-dev",
          likes: 999,
        };
        const response = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(newBlog)
          .expect(200)
          .expect("Content-Type", /^application\/json/);
        assert.strictEqual(response.body.title, newBlog.title);
        assert.strictEqual(response.body.author, newBlog.author);
        assert.strictEqual(response.body.url, newBlog.url);
        assert.strictEqual(response.body.likes, newBlog.likes);

        const blogsAtEnd = await helper.blogsInDb();
        const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
        assert.strictEqual(updatedBlog.title, newBlog.title);
        assert.strictEqual(updatedBlog.author, newBlog.author);
        assert.strictEqual(updatedBlog.url, newBlog.url);
        assert.strictEqual(updatedBlog.likes, newBlog.likes);
      });

      test("succeeds if only likes are given", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];

        const response = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send({
            likes: 999,
          })
          .expect(200)
          .expect("Content-Type", /^application\/json/);
        assert.strictEqual(response.body.likes, 999);

        const blogsAtEnd = await helper.blogsInDb();
        const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
        assert.strictEqual(updatedBlog.likes, 999);
      });

      test("has no effect, if empty object is sent", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];

        const response = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send({})
          .expect(200)
          .expect("Content-Type", /^application\/json/);
        assert.deepStrictEqual(response.body, blogToUpdate);

        const blogsAtEnd = await helper.blogsInDb();
        const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
        assert.deepStrictEqual(updatedBlog, blogToUpdate);
      });

      test("fails with status code 404 if blog does not exist", async () => {
        const nonExistingId = await helper.nonExistingId();

        await api
          .put(`/api/blog/${nonExistingId}`)
          .send({ likes: 999 })
          .expect(404);
      });
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
