const blogsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const user = request.user;

  console.log("creating blog, user: ", user);
  const blog = new Blog({ ...request.body, user: user._id });
  const savedBlog = await blog.save();
  const result = await savedBlog.populate("user", { username: 1, name: 1 });

  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
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

    user.blogs = user.blogs.filter((b) => b.toString() !== blog._id.toString());
    await user.save();

    response.status(204).end();
  },
);

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes, user } = request.body;

  let blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }

  if (user) {
    let newUser = await User.findById(user);

    if (!newUser) {
      return response.status(400).json({ error: "user not found" });
    }
    if (blog.user.toString() !== newUser._id.toString()) {
      return response.status(400).json({ error: "user cannot be changed" });
    }
  }

  blog.title = title || blog.title;
  blog.author = author || blog.author;
  blog.url = url || blog.url;
  blog.likes = likes || blog.likes;

  const updatedBlog = await blog.save();
  const result = await updatedBlog.populate("user", { username: 1, name: 1 });
  response.json(result);
});

module.exports = blogsRouter;
