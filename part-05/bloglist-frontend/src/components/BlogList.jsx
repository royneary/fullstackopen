import Blog from "./Blog";

const BlogList = ({ blogs, user, onLike, onDelete }) => {
  return (
    <div>
      <h2>blogs</h2>
      {blogs
        .sort((b1, b2) => b2.likes - b1.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={() => onLike(blog)}
            onDelete={
              user !== null && user.username === blog.user.username
                ? () => onDelete(blog)
                : null
            }
          />
        ))}
    </div>
  );
};

export default BlogList;
