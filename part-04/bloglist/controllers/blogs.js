const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const user = request.user;

  const blog = new Blog({ ...request.body, user: user._id });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).end();
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({
        error: `user ${user.username} is not the creator of this blog`,
      });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  },
);

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  let blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }

  blog.title = title || blog.title;
  blog.author = author || blog.author;
  blog.url = url || blog.url;
  blog.likes = likes || blog.likes;

  const updatedBlog = await blog.save();
  response.json(updatedBlog);
});

module.exports = blogsRouter;
