const Blog = ({ blog, user, onLike, onDelete }) => {
  if (!blog) {
    return null;
  }

  const authorized = user !== null && user.username === blog.user.username;

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
        likes {blog.likes} {authorized ? likeButton : null}
      </div>
      <div>Added by {blog.author}</div>
      {authorized ? deleteButton : null}
    </div>
  );
};

export default Blog;
