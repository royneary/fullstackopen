const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

describe("blogs API", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("returns all blogs as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /^application\/json/);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("provides identifiers named 'id' and not '_id'", async () => {
    const response = await api.get("/api/blogs");

    response.body.forEach((blog) => {
      assert.notStrictEqual(blog.id, undefined);
      assert.strictEqual(blog._id, undefined);
    });
  });

  test("allows adding a valid blog", async () => {
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

    const newBlogInDb = blogsAtEnd.find((blog) => blog.id === response.body.id);

    assert.notStrictEqual(newBlogInDb, undefined);
    assert.strictEqual(newBlogInDb.title, newBlog.title);
    assert.strictEqual(newBlogInDb.author, newBlog.author);
    assert.strictEqual(newBlogInDb.url, newBlog.url);
    assert.strictEqual(newBlogInDb.likes, newBlog.likes);
  });

  test("assigs a default value for likes when adding a blog", async () => {
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

  test("does not add a blog without a title", async () => {
    const newBlog = {
      author: "Christian Ulrich",
      url: "https://christian.nerdsoli.de/learning-full-stack-web-dev",
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test("does not add a blog without a url", async () => {
    const newBlog = {
      title: "Learning full-stack web development",
      author: "Christian Ulrich",
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
