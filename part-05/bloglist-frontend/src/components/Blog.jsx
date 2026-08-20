const Blog = ({ blog, user, onLike, onDelete }) => {
  if (!blog) {
    return null;
  }

  const isCreator = user && user.username === blog.user.username;

  const likeButton = <button onClick={() => onLike(blog)}>like</button>;

  const deleteButton = <button onClick={() => onDelete(blog)}>remove</button>;

  return (
    <div>
      <h2>
        {blog.author}: {blog.title}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes} {user ? likeButton : null}
      </div>
      <div>Added by {blog.author}</div>
      {isCreator ? deleteButton : null}
    </div>
  );
};

export default Blog;
