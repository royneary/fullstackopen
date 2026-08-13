const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  return blogs.reduce(
    (acc, blog) => (blog.likes > acc.likes ? blog : acc),
    blogs[0],
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const authors = Object.groupBy(blogs, ({ author }) => author);
  const sortedAuthors = Object.entries(authors).sort(
    ([, b1], [, b2]) => b2.length - b1.length,
  );
  const [author, authorBlogs] = sortedAuthors[0];
  return { author, blogs: authorBlogs.length };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const authors = Object.groupBy(blogs, ({ author }) => author);
  const sortedAuthors = Object.entries(authors).sort(
    ([, b1], [, b2]) => totalLikes(b2) - totalLikes(b1),
  );
  const [author, authorBlogs] = sortedAuthors[0];
  return { author, likes: totalLikes(authorBlogs) };
};

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes };
